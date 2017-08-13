/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
"use strict";

import ObjectHelper from './Utilities/ObjectHelper';
import Log from './Utilities/Log';
import Z3 from 'z3javascript';
import Config from './Config';
import {
    WrappedValue,
    ConcolicValue
} from './Values/WrappedValue';

const find = Array.prototype.find;
const map = Array.prototype.map;

function Exists(array1, array2, pred) {

    for (let i = 0; i < array1.length; i++) {
        if (pred(array1[i], array2[i])) {
            return true;
        }
    }

    return false;
}

function DoesntMatch(l, r) {
    if (l === undefined) {
        return r !== '';
    } else {
        return l !== r;
    }
}

function CloneReplace(list, item, n) {
    let clone = list.slice(0);
    clone[clone.indexOf(item)] = n;
    return clone;
}

function CloneRemove(list, item) {
    let c = list.slice(0);
    c.splice(list.indexOf(item), 1);
    return c;
}

function BuildModels() {
    let models = {};

    for (let item in Object.getOwnPropertyNames(Object.prototype)) {
        if (!ObjectHelper.startsWith(item, '__')) {
            delete models[item];
        }
    }

    function EnableCaptures(regex, real, string_s) {
        
        if (!Config.capturesEnabled) {
            Log.log('Captures disabled - potential loss of precision');
        }

        Log.logMid('Captures Enabled - Adding Implications');

        let implies = this.ctx.mkImplies(this.ctx.mkSeqInRe(string_s, regex.ast), this.ctx.mkEq(string_s, regex.implier))

        //Mock the symbolic conditional if (regex.test(/.../) then regex.match => true)
        regex.assertions.forEach(binder => this.state.pushCondition(binder, true));
        this.state.pushCondition(implies, true);
    }

    function BuildRefinements(regex, real, string_s) {

        if (!(Config.capturesEnabled && Config.refinementsEnabled)) {
            Log.log('Refinements disabled - potential accuracy loss');
            return [];
        }
        
        Log.log('Refinements Enabled - Adding checks');

        function CheckCorrect(model) {
            let real_match = real.exec(model.eval(string_s).asConstant());
            let sym_match = regex.captures.map(cap => model.eval(cap).asConstant());
            Log.logMid('Regex sanity check ' + JSON.stringify(real_match) + ' vs ' + JSON.stringify(sym_match));
            return real_match && !Exists(real_match, sym_match, DoesntMatch);
        }

        let NotMatch = Z3.Check(CheckCorrect, (query, model) => {
            let not = this.ctx.mkNot(this.ctx.mkEq(string_s, this.ctx.mkString(model.eval(string_s).asConstant())));
            return [new Z3.Query(query.exprs.slice(0).concat([not]), [CheckFixed, NotMatch])];
        });

        let CheckFixed = Z3.Check(CheckCorrect, (query, model) => {
            //CheckCorrect will check model has a proper match
            let real_match = real.exec(model.eval(string_s).asConstant());

            if (real_match) {
                real_match = real_match.map(match => match || '');
                let query_list = regex.captures.map((cap, idx) => this.ctx.mkEq(this.ctx.mkString(real_match[idx]), cap));
                
                /*
                Log.logMid("WARN: TODO: Removing CheckFixed and NotMatch from checks may break stuff");
                let next_list = CloneReplace(query.checks, CheckFixed, Z3.Check(CheckCorrect, () => []));
                next_list = CloneReplace(query.checks, NotMatch, Z3.Check(CheckCorrect, () => [])); */

                return [new Z3.Query(query.exprs.slice(0).concat(query_list), [])];
            } else {
                Log.log('WARN: Broken regex detected ' + regex.toString() + ' vs ' + real);
                return [];
            }
        });

        return [CheckFixed, NotMatch];
    }

    function RegexTest(regex, real, string, forceCaptures) {
        let in_s = this.ctx.mkSeqInRe(this.state.asSymbolic(string), regex.ast);
        let in_c = real.test(this.state.getConcrete(string));
        let result = new ConcolicValue(in_c, in_s);

        if (regex.backreferences || forceCaptures) {
            EnableCaptures.call(this, regex, real, this.state.asSymbolic(string));
            let checks = BuildRefinements.call(this, regex, real, this.state.asSymbolic(string));
            in_s.checks.trueCheck = checks;
            console.log('Refinements: ' + in_s.checks.trueCheck);
        }

        console.log(JSON.stringify(in_s));

        return result;
    }

    function RegexSearch(real, string, result) {
        let regex = Z3.Regex(this.ctx, real);

        //TODO: There is only the need to force back references if anchors are not set
        let in_regex = RegexTest.apply(this, [regex, real, string, true]);
        
        let search_in_re = this.ctx.mkIte(this.state.getSymbolic(in_regex), regex.startIndex, this.state.wrapConstant(-1));
        
        return new ConcolicValue(result, search_in_re);
    }

    function RegexMatch(real, string, result) {

        let regex = Z3.Regex(this.ctx, real);

        let in_regex = RegexTest.apply(this, [regex, real, string, true]);
        this.state.symbolicConditional(in_regex);

        let string_s = this.state.asSymbolic(string);

        if (result) {

            result = result.map((current_c, idx) => {
                if (typeof current_c == 'string') {
                    return Config.capturesEnabled ? new ConcolicValue(current_c, regex.captures[idx]) : current_c;
                } else {
                    return undefined;
                }
            });

            result.index = new ConcolicValue(result.index, regex.startIndex);
            result.input = string;
        }

        return result;
    }

    /**
     * Symbolic hook is a helper function which builds concrete results and then,
     * if condition() -> true executes a symbolic helper specified by hook
     * Both hook and condition are called with (context (SymbolicExecutor), f, base, args, result)
     *
     * A function which makes up the new function model is returned
     */
    function symbolicHook(condition, hook) {
        return function(f, base, args, result) {

            result = undefined;
            let thrown = undefined;

            //Defer throw until after hook has run
            try {
                result = f.apply(this.state.getConcrete(base), map.call(args, arg => this.state.getConcrete(arg)));
            } catch (e) {
                thrown = e;
            }

            Log.logMid(`Symbolic Testing ${f.name} with base ${ObjectHelper.asString(base)} and ${ObjectHelper.asString(args)} and initial result ${ObjectHelper.asString(result)}`);

            if (condition(this, f, base, args, result)) {
                result = hook(this, f, base, args, result);
            }

            Log.logMid(`Result: ${'' + result} Thrown: ${'' + thrown}`);

            if (thrown) {
                throw thrown;
            }

            return result;
        };
    }

    function NoOp() {
        return function(f, base, args, result) {
            Log.logMid(`NoOp ${f.name} with base ${ObjectHelper.asString(base)} and ${ObjectHelper.asString(args)}`);
            return f.apply(base, args);
        };
    }

    /**
     * Model for String(xxx) in code to coerce something to a string
     */
    models[String] = symbolicHook(
        (c, _f, _base, args, _result) => c.state.isSymbolic(args[0]),
        (c, _f, _base, args, result) => new ConcolicValue(result, c.state.asSymbolic(c._concretizeToString(args[0])))
    );

    models[String.prototype.substr] = symbolicHook(
        (c, _f, base, args, _) => c.state.isSymbolic(base) || c.state.isSymbolic(args[0]) || c.state.isSymbolic(args[1]),
        (c, _f, base, args, result) => {
            Log.log('WARNING: Symbolic substring support new and buggy');

            let target = c.state.asSymbolic(base);
            let start_off = c.ctx.mkRealToInt(c.state.asSymbolic(args[0]));

            let len;

            if (args[1]) {
                len = c.state.asSymbolic(args[1]);
                len = c.ctx.mkRealToInt(len);
            } else {
                len = c.ctx.mkSub(c.ctx.mkSeqLength(target), start_off);
            }

            return new ConcolicValue(result, c.ctx.mkSeqSubstr(target, start_off, len));
        }
    );

    models[String.prototype.substring] = models[String.prototype.substr];

    models[String.prototype.charAt] = symbolicHook(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) || c.state.isSymbolic(args[0]),
        (c, _f, base, args, result) => new ConcolicValue(result, c.ctx.mkSeqAt(c.state.asSymbolic(base), c.ctx.mkRealToInt(c.state.asSymbolic(args[0]))))
    );

    models[String.prototype.concat] = symbolicHook(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) || find.call(args, arg => c.state.isSymbolic(arg)),
        (c, _f, base, args, result) => new ConcolicValue(result, c.ctx.mkSeqConcat([c.state.asSymbolic(base)].concat(args.map(arg => c.state.asSymbolic(arg)))))
    );

    models[String.prototype.indexOf] = symbolicHook(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) || c.state.isSymbolic(args[0]) || c.state.isSymbolic(args[1]),
        (c, _f, base, args, result) => {
            let off = args[1] ? c.state.asSymbolic(args[1]) : c.state.asSymbolic(0);
            off = c.ctx.mkRealToInt(off);
            result = new ConcolicValue(result, c.ctx.mkSeqIndexOf(c.state.asSymbolic(base), c.state.asSymbolic(c._concretizeToString(args[0])), off));
            return result;
        }
    );

    models[String.prototype.search] = symbolicHook(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) && args[0] instanceof RegExp,
        (c, _f, base, args, result) => RegexSearch.call(c, args[0], base, result)
    );

    models[String.prototype.match] = symbolicHook(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) && args[0] instanceof RegExp,
        (c, _f, base, args, result) => RegexMatch.call(c, args[0], base, result)
    );

    models[RegExp.prototype.exec] = symbolicHook(
        (c, _f, base, args, _r) => base instanceof RegExp && c.state.isSymbolic(args[0]),
        (c, _f, base, args, result) => RegexMatch.call(c, base, args[0], result)
    );

    models[RegExp.prototype.test] = symbolicHook(
        (c, _f, _base, args, _r) => c.state.isSymbolic(args[0]),
        (c, _f, base, args, result) => RegexTest.call(c, Z3.Regex(c.ctx, base), base, c._concretizeToString(args[0]))
    );

    //Replace model for replace regex by string. Does not model replace with callback.
    models[String.prototype.replace] = symbolicHook(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) && args[0] instanceof RegExp && typeof args[1] === 'string',
        (c, _f, base, args, result) => {
            Log.log('TODO: Awful String.prototype.replace model will reduce search space');

            let test = c.state.getConcrete(base) === result;

            Log.logMid(`Replace test = ${test}`);

            let regex = Z3.Regex(c.ctx, args[0]);

            let baseInRe = c.ctx.mkSeqInRe(c.state.getSymbolic(base), regex.ast);
            test ? c.state.pushNot(baseInRe) : c.state.pushCondition(baseInRe);
            return new ConcolicValue(result, c.state.getSymbolic(base));
        }
    );

    models[String.prototype.trim] = symbolicHook(
        (c, _f, base, _a, _r) => c.state.isSymbolic(base),
        (c, _f, base, _a, result) => {
            Log.log('TODO: Trim model does not currently do anything');
            return new ConcolicValue(result, c.state.getSymbolic(base));
        }
    );

    models[String.prototype.toLowerCase] = function(f, base, args, result) {
        result = f.apply(this.state.getConcrete(base));

        if (this.state.isSymbolic(base)) {
            Log.log('TODO: Awful String.prototype.toLowerCase model will reduce search space');
            base = this._concretizeToString(base);
            let azRegex = Z3.Regex(this.ctx, /^[^A-Z]+$/);
            this.state.pushCondition(this.ctx.mkSeqInRe(this.state.getSymbolic(base), azRegex.ast), true);
            result = new ConcolicValue(result, this.state.getSymbolic(base));
        }

        return result;
    };

    models[Number.prototype.toFixed] = symbolicHook(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) || c.state.isSymbolic(args[0]),
        (c, _f, base, args, result) => {
            const toFix = c.state.asSymbolic(base);
            const requiredDigits = c.state.asSymbolic(args[0]);
            const gte0 = c.ctx.mkGe(requiredDigits, c.ctx.mkIntVal(0));
            const lte20 = c.ctx.mkLe(requiredDigits, c.ctx.mkIntVal(20));
            const validRequiredDigitsSymbolic = c.ctx.mkAnd(lte20, gte0);
            const validRequiredDigits = c.state.getConcrete(args[0]) >= 0 && c.state.getConcrete(args[0]) <= 20;

            c.state.symbolicConditional(new ConcolicValue(!!validRequiredDigits, validRequiredDigitsSymbolic));

            if (validRequiredDigits) {
                //TODO: Need to coerce result to string

                // const pow = c.ctx.mkPower(c.state.asSymbolic(10), requiredDigits)
                // const symbolicValue = c.ctx.mkDiv(c.ctx.mkInt2Real(c.ctx.mkReal2Int(c.ctx.mkMul(pow, toFix))), c.state.asSymbolic(10.0))
                //return new ConcolicValue(result, symbolicValue);
                return result;
            }
            else {
                // f.Apply() will throw
            }
        }
    );

    models[Array.prototype.push] = NoOp();
    models[Array.prototype.keys] = NoOp();
    models[Array.prototype.concat] = NoOp();
    models[Array.prototype.forEach] = NoOp();
    models[Array.prototype.slice] = NoOp();
    models[Array.prototype.filter] = NoOp();
    models[Array.prototype.map] = NoOp();
    models[Array.prototype.shift] = NoOp();
    models[Array.prototype.unshift] = NoOp();
    models[Array.prototype.fill] = NoOp();

    return models;
}

export default BuildModels();

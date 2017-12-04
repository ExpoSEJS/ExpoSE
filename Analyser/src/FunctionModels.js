/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
"use strict";

import ObjectHelper from './Utilities/ObjectHelper';
import Log from './Utilities/Log';
import Z3 from 'z3javascript';
import Config from './Config';
import NotAnErrorException from './NotAnErrorException';
import {
    WrappedValue,
    ConcolicValue
} from './Values/WrappedValue';

const find = Array.prototype.find;
const map = Array.prototype.map;

function DoesntMatch(l, r) {
    if (l === undefined) {
        return r !== '';
    } else {
        return l !== r;
    }
}

function Exists(array1, array2, pred) {

    for (let i = 0; i < array1.length; i++) {
        if (pred(array1[i], array2[i])) {
            return true;
        }
    }

    return false;
}

/**
 * Builds a set of function models bound to a given SymbolicState
 */
function BuildModels(state) {
    const ctx = state.ctx;

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

        let implies = this.state.ctx.mkImplies(this.state.ctx.mkSeqInRe(string_s, regex.ast), this.state.ctx.mkEq(string_s, regex.implier))

        //Mock the symbolic conditional if (regex.test(/.../) then regex.match => true)
        regex.assertions.forEach(binder => this.state.pushCondition(binder, true));
        this.state.pushCondition(implies, true);
    }

    function BuildRefinements(regex, real, string_s) {

        if (!(Config.capturesEnabled && Config.refinementsEnabled)) {
            Log.log('Refinements disabled - potential accuracy loss');
            return {
                trueCheck: [],
                falseCheck: []
            };
        }
        
        Log.log('Refinements Enabled - Adding checks');

        function CheckCorrect(model) {
            let real_match = real.exec(model.eval(string_s).asConstant(model));
            let sym_match = regex.captures.map(cap => model.eval(cap).asConstant(model));
            Log.logMid('Regex sanity check ' + JSON.stringify(real_match) + ' vs ' + JSON.stringify(sym_match));
            return real_match && !Exists(real_match, sym_match, DoesntMatch);
        }

        function CheckFailed(model) {
            return !real.test(model.eval(string_s).asConstant(model));
        }

        let NotMatch = Z3.Check(CheckCorrect, (query, model) => {
            let not = this.state.ctx.mkNot(this.state.ctx.mkEq(string_s, this.state.ctx.mkString(model.eval(string_s).asConstant(model))));
            return [new Z3.Query(query.exprs.slice(0).concat([not]), [CheckFixed, NotMatch])];
        });

        let CheckFixed = Z3.Check(CheckCorrect, (query, model) => {
            //CheckCorrect will check model has a proper match
            let real_match = real.exec(model.eval(string_s).asConstant(model));

            if (real_match) {
                real_match = real_match.map(match => match || '');
                let query_list = regex.captures.map((cap, idx) => this.state.ctx.mkEq(this.state.ctx.mkString(real_match[idx]), cap));
                return [new Z3.Query(query.exprs.slice(0).concat(query_list), [])];
            } else {
                Log.log('WARN: Broken regex detected ' + regex.ast.toString() + ' vs ' + real);
                Log.log('WARN: No Highly Specific Refinements');
                return [];
            }
        });

        let CheckNotIn = Z3.Check(CheckFailed, (query, model) => {
            Log.log('BIG WARN: False check failed, possible divergence');
            return [];
        });

        return {
            trueCheck: [NotMatch, CheckFixed],
            falseCheck: [CheckNotIn]
        };
    }

    function RegexTest(regex, real, string, careAboutCaptures) {
        let in_s = this.state.ctx.mkSeqInRe(this.state.asSymbolic(string), regex.ast);
        let in_c = real.test(this.state.getConcrete(string));
        let result = new ConcolicValue(in_c, in_s);

        if (regex.backreferences || careAboutCaptures) {
            EnableCaptures.call(this, regex, real, this.state.asSymbolic(string));
            let checks = BuildRefinements.call(this, regex, real, this.state.asSymbolic(string));
            in_s.checks.trueCheck = checks.trueCheck;
            //in_s.checks.falseCheck = checks.false; Don't need as we currently don't enforce over-approx negation
        }

        return result;
    }

    function RegexSearch(real, string, result) {

        let regex = Z3.Regex(this.state.ctx, real);
        let in_regex = RegexTest.apply(this, [regex, real, string, true]);
        let search_in_re = this.state.ctx.mkIte(this.state.getSymbolic(in_regex), regex.startIndex, this.state.wrapConstant(-1));

        return new ConcolicValue(result, search_in_re);
    }

    function RegexMatch(real, string, result) {

        let regex = Z3.Regex(this.state.ctx, real);

        let in_regex = RegexTest.apply(this, [regex, real, string, true]);
        this.state.symbolicConditional(in_regex);

        let string_s = this.state.asSymbolic(string);

        if (this.state.getConcrete(in_regex)) {

            let rewrittenResult = [];

            if (Config.capturesEnabled) {
                rewrittenResult = result.map((current_c, idx) => {
                    //TODO: This is really nasty, current_c should be a
                    return new ConcolicValue(current_c === undefined ? '' : current_c, regex.captures[idx]);
                });
            }

            rewrittenResult.index = new ConcolicValue(result.index, regex.startIndex);
            rewrittenResult.input = string;

            result = rewrittenResult;
        }

        return result;
    }

    /**
     * In JavaScript slice and substr can be given a negative index to indicate addressing from the end of the array
     * We need to rewrite the SMT to handle these cases
     */
    function substringHandleNegativeLengths(base_s, index_s) {

        //Index s is negative to adding will get us to the right start
        let indexFromLength = ctx.mkAdd(base_s.getLength(), index_s);

        //Bound the minimum index by 0
        const aboveMin = ctx.mkGe(indexFromLength, ctx.mkIntVal(0));
        indexFromLength = ctx.mkIte(aboveMin, indexFromLength, ctx.mkIntVal(0));

        return ctx.mkIte(ctx.mkGe(index_s, ctx.mkIntVal(0)), index_s, indexFromLength);
    }

    function substringHelper(_f, base, args, result) {
        state.stats.seen('Symbolic Substrings');

        const target = state.asSymbolic(base);

        //The start offset is either the argument of str.len - the arguments
        let start_off = ctx.mkRealToInt(state.asSymbolic(args[0]));
        start_off = substringHandleNegativeLengths(target, start_off);

        //Length defaults to the entire string if not specified
        let len;
        const maxLength = ctx.mkSub(target.getLength(), start_off);

        if (args[1]) {
            len = state.asSymbolic(args[1]);
            len = ctx.mkRealToInt(len);

            //If the length is user-specified bound the length of the substring by the maximum size of the string ("123".slice(0, 8) === "123")
            const exceedMax = ctx.mkGe(ctx.mkAdd(start_off, len), target.getLength());
            len = ctx.mkIte(exceedMax, maxLength, len);

        } else {
            len = maxLength
        }

        //If the start index is greater than or equal to the length of the string the empty string is returned
        const substr_s = ctx.mkSeqSubstr(target, start_off, len);
        const empty_s = ctx.mkString("");
        const result_s = ctx.mkIte(ctx.mkGe(start_off, target.getLength()), empty_s, substr_s);

        return new ConcolicValue(result, result_s);
    }

    function rewriteTestSticky(real, target, result) {
        
        if (real.sticky || real.global) {

            let lastIndex = real.lastIndex;
            let lastIndex_s = this.state.asSymbolic(real.lastIndex);
            let lastIndex_c = this.state.getConcrete(real.lastIndex);
            real.lastIndex = lastIndex_c;

            let realResult = real.exec(this.state.getConcrete(target));

            if (lastIndex_c) {
                let part_c = this.state.getConcrete(target);
                let part_s = this.state.getSymbolic(target);

                let real_cut = part_c.substring(lastIndex_c, part_c.length);

                target = substringHelper.call(this,
                    this, null, target,
                    [lastIndex, new ConcolicValue(part_c.length, part_s.getLength())],
                    real_cut
                );
            }

            let matchResult = RegexMatch.call(this, real, target, realResult);

            if (matchResult) {
                let firstAdd = new ConcolicValue(lastIndex_c + this.state.getConcrete(matchResult.index), this.state.symbolicBinary('+', lastIndex_c, lastIndex_s, this.state.getConcrete(matchResult.index), this.state.asSymbolic(matchResult.index)));
                let secondAdd = new ConcolicValue(this.state.getConcrete(firstAdd), this.state.getConcrete(matchResult[0]).length, 
                    this.state.symbolicBinary('+', this.state.getConcrete(firstAdd), this.state.asSymbolic(firstAdd), this.state.getConcrete(matchResult[0].length), this.state.asSymbolic(matchResult[0]).getLength()));
                real.lastIndex = secondAdd;
                return true;
            } else {
                return false;
            }

        } else {
            return RegexTest.call(this, Z3.Regex(this.state.ctx, real), real, target, false);
        }
    }

    /**
     * Symbolic hook is a helper function which builds concrete results and then,
     * if condition() -> true executes a symbolic helper specified by hook
     * Both hook and condition are called with (context (SymbolicExecutor), f, base, args, result)
     *
     * A function which makes up the new function model is returned
     */
    function symbolicHook(condition, hook, featureDisabled) {
        return function(f, base, args, result) {

            result = undefined;
            let thrown = undefined;

            //Defer throw until after hook has run
            try {
                result = f.apply(state.getConcrete(base), map.call(args, arg => state.getConcrete(arg)));
            } catch (e) {
                thrown = e;
            }

            Log.logMid(`Symbolic Testing ${f.name} with base ${ObjectHelper.asString(base)} and ${ObjectHelper.asString(args)} and initial result ${ObjectHelper.asString(result)}`);

            if (!featureDisabled && condition(f, base, args, result)) {
                result = hook(f, base, args, result);
            }

            Log.logMid(`Result: ${'' + result} Thrown: ${'' + thrown}`);

            if (thrown) {
                throw thrown;
            }

            return result;
        };
    }

    //Hook for regex methods, will only hook if regex is enabled
    function symbolicHookRe(condition, hook) {
        return symbolicHook(condition, function(env) {
            //Intercept the hook to do regex stats
            env.state.stats.seen('Regular Expressions');
            return hook.apply(this, arguments);
        }, !Config.regexEnabled);
    }

    function NoOp() {
        return function(f, base, args, result) {
            Log.logMid(`NoOp ${f.name} with base ${ObjectHelper.asString(base)} and ${ObjectHelper.asString(args)}`);
            return f.apply(base, args);
        };
    }

    function concretizeToString(symbol) {

        if (typeof state.getConcrete(symbol) !== 'string') {
            Log.log('TODO: Concretizing non string input to test rather than int2string, bool2string etc');
            Log.log('' + symbol + ' reduced to ' + '' + state.getConcrete(symbol));

            const cval = '' + state.getConcrete(symbol);
            return new ConcolicValue(cval, state.asSymbolic(cval));
        }

        return symbol;
    }


    /**
     * Model for String(xxx) in code to coerce something to a string
     */
    models[String] = symbolicHook(
        (_f, _base, args, _result) => state.isSymbolic(args[0]),
        (_f, _base, args, result) => concretizeToString(args[0])
    );

    models[String.prototype.substr] = symbolicHook(
        (_f, base, args, _) => typeof state.getConcrete(base) === "string" && (state.isSymbolic(base) || state.isSymbolic(args[0]) || state.isSymbolic(args[1])),
        substringHelper
    );

    models[String.prototype.substring] = models[String.prototype.substr];
    
    /**
     * TODO: Can impact Array.prototype.slice
     * It appears that (at least sometimes) all the slices map to the same native method and so need to be modelled the same
     */
    models[String.prototype.slice] = models[String.prototype.substr];

    models[String.prototype.charAt] = symbolicHook(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) || c.state.isSymbolic(args[0]),
        (c, _f, base, args, result) => new ConcolicValue(result, c.state.ctx.mkSeqAt(c.state.asSymbolic(base), c.state.ctx.mkRealToInt(c.state.asSymbolic(args[0]))))
    );

    models[String.prototype.concat] = symbolicHook(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) || find.call(args, arg => c.state.isSymbolic(arg)),
        (c, _f, base, args, result) => new ConcolicValue(result, c.state.ctx.mkSeqConcat([c.state.asSymbolic(base)].concat(args.map(arg => c.state.asSymbolic(arg)))))
    );

    models[String.prototype.indexOf] = symbolicHook(
        (c, _f, base, args, _r) => typeof c.state.getConcrete(base) === 'string' && (c.state.isSymbolic(base) || c.state.isSymbolic(args[0]) || c.state.isSymbolic(args[1])),
        (c, _f, base, args, result) => {
            let off = args[1] ? c.state.asSymbolic(args[1]) : c.state.asSymbolic(0);
            off = c.state.ctx.mkRealToInt(off);
            result = new ConcolicValue(result, c.state.ctx.mkSeqIndexOf(c.state.asSymbolic(base), c.state.asSymbolic(concretizeToString(c, args[0])), off));
            return result;
        }
    );

    models[String.prototype.search] = symbolicHookRe(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) && args[0] instanceof RegExp,
        (c, _f, base, args, result) => RegexSearch.call(c, args[0], base, result)
    );

    models[String.prototype.match] = symbolicHookRe(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) && args[0] instanceof RegExp,
        (c, _f, base, args, result) => RegexMatch.call(c, args[0], base, result)
    );

    models[RegExp.prototype.exec] = symbolicHookRe(
        (c, _f, base, args, _r) => base instanceof RegExp && c.state.isSymbolic(args[0]),
        (c, _f, base, args, result) => RegexMatch.call(c, base, args[0], result)
    );

    models[RegExp.prototype.test] = symbolicHookRe(
        (c, _f, _base, args, _r) => c.state.isSymbolic(args[0]),
        (c, _f, base, args, result) => rewriteTestSticky.call(c, base, concretizeToString(c, args[0]), result)
    );

    //Replace model for replace regex by string. Does not model replace with callback.
    models[String.prototype.replace] = symbolicHookRe(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) && args[0] instanceof RegExp && typeof args[1] === 'string',
        (c, _f, base, args, result) => {
            return c.state.getConcrete(base).secret_replace.apply(base, args);
        }
    );

    models[String.prototype.split] = symbolicHookRe(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) && args[0] instanceof RegExp,
        (c, _f, base, args, result) => {
            return c.state.getConcrete(base).secret_split.apply(base, args);
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
            Log.log('TODO: String.prototype.toLowerCase model is weak, can reduce coverage');
            base = concretizeToString(this, base);
            let azRegex = Z3.Regex(this.state.ctx, /^[^A-Z]+$/);
            this.state.pushCondition(this.state.ctx.mkSeqInRe(this.state.getSymbolic(base), azRegex.ast), true);
            result = new ConcolicValue(result, this.state.getSymbolic(base));
        }

        return result;
    };

    /*
    TODO: Fix this model
    models[Number.prototype.toFixed] = symbolicHook(
        (c, _f, base, args, _r) => c.state.isSymbolic(base) || c.state.isSymbolic(args[0]),
        (c, _f, base, args, result) => {
            const toFix = c.state.asSymbolic(base);
            const requiredDigits = c.state.asSymbolic(args[0]);
            const gte0 = c.state.ctx.mkGe(requiredDigits, c.state.ctx.mkIntVal(0));
            const lte20 = c.state.ctx.mkLe(requiredDigits, c.state.ctx.mkIntVal(20));
            const validRequiredDigitsSymbolic = c.state.ctx.mkAnd(lte20, gte0);
            const validRequiredDigits = c.state.getConcrete(args[0]) >= 0 && c.state.getConcrete(args[0]) <= 20;

            c.state.symbolicConditional(new ConcolicValue(!!validRequiredDigits, validRequiredDigitsSymbolic));

            if (validRequiredDigits) {
                //TODO: Need to coerce result to string

                // const pow = c.state.ctx.mkPower(c.state.asSymbolic(10), requiredDigits)
                // const symbolicValue = c.state.ctx.mkDiv(c.state.ctx.mkInt2Real(c.state.ctx.mkReal2Int(c.state.ctx.mkMul(pow, toFix))), c.state.asSymbolic(10.0))
                //return new ConcolicValue(result, symbolicValue);
                return result;
            }
            // f.Apply() will throw ifthis fails
        }
    );
    */

    models[Array.prototype.push] = NoOp();
    models[Array.prototype.keys] = NoOp();
    models[Array.prototype.concat] = NoOp();
    models[Array.prototype.forEach] = NoOp();
    models[Array.prototype.filter] = NoOp();
    models[Array.prototype.map] = NoOp();
    models[Array.prototype.shift] = NoOp();
    models[Array.prototype.unshift] = NoOp();
    models[Array.prototype.fill] = NoOp();

    //TODO: Test IsNative for apply, bind & call
    models[Function.prototype.apply] = NoOp();
    models[Function.prototype.call] = NoOp();

    /**
     * Secret _expose hooks for symbols.js
     */

    Object._expose = {};

    Object._expose.makeSymbolic = function() { return 'MakeSymbolic'; };
    Object._expose.notAnError = function() { return NotAnErrorException; };

    models[Object._expose.makeSymbolic] = symbolicHook(
        () => true,
        (_f, base, args, result) => { 
            Log.log('Creating symbolic variable ' + args[0]);
            return state.createSymbolicValue(args[0], args[1]);
        }
    );

    models[Object._expose.notAnError] = symbolicHook(
        () => true,
        () => NotAnErrorException
    );

    return models;
}

export default BuildModels;

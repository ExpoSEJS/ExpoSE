/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
"use strict";

import ObjectHelper from './Utilities/ObjectHelper';
import Log from './Utilities/Log';
import Z3 from 'z3javascript';
import Config from './Config';
import NotAnErrorException from './NotAnErrorException';
import { isNative } from './Utilities/IsNative';
import { WrappedValue, ConcolicValue } from './Values/WrappedValue';

const find = Array.prototype.find;
const map = Array.prototype.map;

function DoesntMatch(l, r) {
    return l === undefined ? r !== '' : l !== r;
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

        const implies = ctx.mkImplies(ctx.mkSeqInRe(string_s, regex.ast),
            ctx.mkEq(string_s, regex.implier));

        //Mock the symbolic conditional if (regex.test(/.../) then regex.match => true)
        regex.assertions.forEach(binder => state.pushCondition(binder, true));
        state.pushCondition(implies, true);
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
            const real_match = real.exec(model.eval(string_s).asConstant(model));
            const sym_match = regex.captures.map(cap => model.eval(cap).asConstant(model));

    	    Log.logMid(`Regex sanity check ${JSON.stringify(real_match)} vs ${JSON.stringify(sym_match)}`);
                
    	    const is_correct = real_match && !Exists(real_match, sym_match, DoesntMatch);
       	    
    	    state.stats.seen('Regex Checks');	
    	    
    	    if (!is_correct) {
    		    state.stats.seen('Failed Regex Checks');
    	    }

    	    return is_correct;
    	}

        function CheckFailed(model) {
            const is_failed = !real.test(model.eval(string_s).asConstant(model));
            
            state.stats.seen('Regex Checks');
            
            if (!is_failed) {
        	    state.stats.seen('Failed Regex Checks'); 
            }

            return is_failed;
        }

        const NotMatch = Z3.Check(CheckCorrect, (query, model) => {

            const not = ctx.mkNot(
                ctx.mkEq(string_s, ctx.mkString(model.eval(string_s).asConstant(model)))
            );

            return [new Z3.Query(query.exprs.slice(0).concat([not]), [CheckFixed, NotMatch])];
        });

        /**
         * Generate a fixed string refinement (c_0, c_n, ...) == (e_0, e_n, ...)
         */
        const CheckFixed = Z3.Check(CheckCorrect, (query, model) => {
            let real_match = real.exec(model.eval(string_s).asConstant(model));

            if (!real_match) {
                Log.log(`WARN: Broken regex detected ${regex.ast.toString()} vs ${real}`);
                return [];
            }
            
            real_match = real_match.map(match => match || '');

            const query_list = regex.captures.map(
                (cap, idx) => ctx.mkEq(ctx.mkString(real_match[idx]), cap)
            );

            return [new Z3.Query(query.exprs.slice(0).concat(query_list), [])];
        });

        const CheckNotIn = Z3.Check(CheckFailed, (query, model) => {
            Log.log('ERROR: False check failed, possible divergence');
            return [];
        });

        return {
            trueCheck: [NotMatch, CheckFixed],
            falseCheck: [CheckNotIn]
        };
    }

    function RegexTest(regex, real, string, careAboutCaptures) {

        const in_s = ctx.mkSeqInRe(
            state.asSymbolic(string),
            regex.ast
        );

        const in_c = real.test(state.getConcrete(string));

        if (regex.backreferences || careAboutCaptures) {
            EnableCaptures(regex, real, state.asSymbolic(string));
            const checks = BuildRefinements(regex, real, state.asSymbolic(string));
            in_s.checks.trueCheck = checks.trueCheck;
            //in_s.checks.falseCheck = checks.falseCheck;
        }

        return new ConcolicValue(in_c, in_s);
    }

    function RegexSearch(real, string, result) {

        const regex = Z3.Regex(ctx, real);
        const in_regex = RegexTest(regex, real, string, true);
        
        const search_in_re = ctx.mkIte(
            state.asSymbolic(in_regex),
            regex.startIndex,
            state.constantSymbol(-1)
        );

        return new ConcolicValue(result, search_in_re);
    }

    function RegexMatch(real, string, result) {

        const regex = Z3.Regex(ctx, real);
        const in_regex = RegexTest(regex, real, string, true);
        state.conditional(in_regex);

        const string_s = state.asSymbolic(string);

        if (Config.capturesEnabled && state.getConcrete(in_regex)) {

            const rewrittenResult = result.map((current_c, idx) => {
                //TODO: This is really nasty, current_c should be a
                const current_rewrite = current_c === undefined ? '' : current_c;
                return new ConcolicValue(current_rewrite, regex.captures[idx]);
            });

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
        const newIndex = ctx.mkAdd(base_s.getLength(), index_s);

        //Bound the minimum index by 0
        const aboveMin = ctx.mkGe(newIndex, ctx.mkIntVal(0));
        const indexOrZero = ctx.mkIte(aboveMin, newIndex, ctx.mkIntVal(0));

        return ctx.mkIte(ctx.mkGe(index_s, ctx.mkIntVal(0)), index_s, indexOrZero);
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
            const exceedMax = ctx.mkGe(
                ctx.mkAdd(start_off, len),
                target.getLength()
            );

            len = ctx.mkIte(exceedMax, maxLength, len);
        } else {
            len = maxLength
        }

        //If the start index is greater than or equal to the length of the string the empty string is returned
        const substr_s = ctx.mkSeqSubstr(target, start_off, len);
        const empty_s = ctx.mkString("");
        const result_s = ctx.mkIte(
            ctx.mkGe(start_off, target.getLength()),
            empty_s,
            substr_s
        );

        return new ConcolicValue(result, result_s);
    }

    /**
     * Applies the rules for a sticky flag to a regex operation
     */
    function rewriteTestSticky(real, target, result) {
        
        if (real.sticky || real.global) {

            state.stats.seen('Sticky / Global Regex');

            const lastIndex = real.lastIndex;
            const lastIndex_s = state.asSymbolic(real.lastIndex);
            const lastIndex_c = state.getConcrete(real.lastIndex);
            real.lastIndex = lastIndex_c;

            const realResult = real.exec(state.getConcrete(target));

            if (lastIndex_c) {
                const part_c = state.getConcrete(target);
                const part_s = state.asSymbolic(target);

                const real_cut = part_c.substring(lastIndex_c, part_c.length);

                target = substringHelper(null, target,
                    [lastIndex, new ConcolicValue(part_c.length, part_s.getLength())],
                    real_cut
                );
            }

            const matchResult = RegexMatch(real, target, realResult);

            if (matchResult) {

                const matchLength = new ConcolicValue(
                    state.getConcrete(matchResult[0]).length,
                    state.asSymbolic(matchResult[0]).getLength()
                );

                const currentIndex = state.binary('+', lastIndex, matchResult.index);
                real.lastIndex = state.binary('+', currentIndex, matchLength);
                return true;
            }
        
            return false;
        } else {
            return RegexTest(Z3.Regex(ctx, real), real, target, false);
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
        return symbolicHook(condition, function() {
            //Intercept the hook to do regex stats
            state.stats.seen('Regular Expressions');
            return hook.apply(this, arguments);
        }, !Config.regexEnabled);
    }

    function NoOp() {
        return function(f, base, args, result) {
            Log.logMid(`NoOp ${f.name} with base ${ObjectHelper.asString(base)} and ${ObjectHelper.asString(args)}`);
            return f.apply(base, args);
        };
    }

    function ConcretizeIfNative(arg_num) {
        return function(f, base, args, result) {
            let is_native = isNative(args[arg_num]);
            if (is_native) {
                Log.log('WARNING: Concretizing model for ' + f.name);
                base = state.getConcrete(base);
                args = args.map(x => state.getConcrete(x));
            }

            return f.apply(base, args);
        };
    }

    function coerceToString(symbol) {
        
        if (typeof state.getConcrete(symbol) !== 'string') {
            Log.log(`TODO: Concretizing non string input ${symbol} reduced to ${state.getConcrete(symbol)}`);
            return new ConcolicValue(
                state.getConcrete(symbol),
                state.asSymbolic('' + state.getConcrete(symbol))
            );
        }

        return symbol;
    }


    /**
     * Stubs string constructor with our (flaky) coerceToString fn
     */
    models[String] = symbolicHook(
        (_f, _base, args, _result) => state.isSymbolic(args[0]),
        (_f, _base, args, result) => coerceToString(args[0])
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
        (_f, base, args, _r) => {
            const is_symbolic = (state.isSymbolic(base) || state.isSymbolic(args[0]));
            const is_well_formed = typeof state.getConcrete(base) === "string" && typeof state.getConcrete(args[0]) === "number";
            return is_symbolic && is_well_formed;
        },
        (_f, base, args, result) => {
            const index_s = ctx.mkRealToInt(state.asSymbolic(args[0]));
            const char_s = ctx.mkSeqAt(state.asSymbolic(base), index_s);
            return new ConcolicValue(result, char_s);
        }
    );

    models[String.prototype.concat] = symbolicHook(
        (_f, base, args, _r) => state.isSymbolic(base) || find.call(args, arg => state.isSymbolic(arg)),
        (_f, base, args, result) => {
            const arg_s_list = args.map(arg => state.asSymbolic(arg));
            const concat_s = ctx.mkSeqConcat([state.asSymbolic(base)].concat(arg_s_list));
            return new ConcolicValue(result, concat_s);
        }
    );

    models[String.prototype.indexOf] = symbolicHook(
        (_f, base, args, _r) => typeof state.getConcrete(base) === 'string' && (state.isSymbolic(base) || state.isSymbolic(args[0]) || state.isSymbolic(args[1])),
        (_f, base, args, result) => {
            const off_real = args[1] ? state.asSymbolic(args[1]) : state.asSymbolic(0);
            const off_s = ctx.mkRealToInt(off_real);
            const target_s = state.asSymbolic(coerceToString(args[0]));
            const seq_index = ctx.mkSeqIndexOf(state.asSymbolic(base), target_s, off_s);
            return new ConcolicValue(result, seq_index);
        }
    );

    models[String.prototype.search] = symbolicHookRe(
        (_f, base, args, _r) => state.isSymbolic(base) && args[0] instanceof RegExp,
        (_f, base, args, result) => RegexSearch(args[0], base, result)
    );

    models[String.prototype.match] = symbolicHookRe(
        (_f, base, args, _r) => state.isSymbolic(base) && args[0] instanceof RegExp,
        (_f, base, args, result) => RegexMatch(args[0], base, result)
    );

    models[RegExp.prototype.exec] = symbolicHookRe(
        (_f, base, args, _r) => base instanceof RegExp && state.isSymbolic(args[0]),
        (_f, base, args, result) => RegexMatch(base, args[0], result)
    );

    models[RegExp.prototype.test] = symbolicHookRe(
        (_f, _base, args, _r) => state.isSymbolic(args[0]),
        (_f, base, args, result) => rewriteTestSticky(base, coerceToString(args[0]), result)
    );

    //Replace model for replace regex by string. Does not model replace with callback.
    models[String.prototype.replace] = symbolicHookRe(
        (_f, base, args, _r) => state.isSymbolic(base) && args[0] instanceof RegExp && typeof args[1] === 'string',
        (_f, base, args, result) => state.getConcrete(base).secret_replace.apply(base, args)
    );

    models[String.prototype.split] = symbolicHookRe(
        (_f, base, args, _r) => state.isSymbolic(base) && args[0] instanceof RegExp,
        (_f, base, args, result) => state.getConcrete(base).secret_split.apply(base, args)
    );

    models[String.prototype.trim] = symbolicHook(
        (_f, base, _a, _r) => state.isSymbolic(base),
        (_f, base, _a, result) => {
            Log.log('TODO: Trim model does not currently do anything');
            return new ConcolicValue(result, state.asSymbolic(base));
        }
    );

    models[String.prototype.toLowerCase] = symbolicHook(
        (_f, base, _a, _r) => state.isSymbolic(base),
        (_f, base, _a, result) => {
            base = coerceToString(base);

            state.pushCondition(
                ctx.mkSeqInRe(state.asSymbolic(base), Z3.Regex(ctx, /^[^A-Z]+$/).ast),
                true
            );

            return new ConcolicValue(result, state.asSymbolic(base));
        }
    );

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

            c.state.conditional(new ConcolicValue(!!validRequiredDigits, validRequiredDigitsSymbolic));

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

    let indexOfCounter = 0;

    function mkIndexSymbol(op) {
        return ctx.mkIntVar(`_${op}_${indexOfCounter++})`);
    }
    
    let funcCounter = 0;
    
    function mkFunctionName(fn) {
        return ctx.mkStringSymbol(`_fn_${fn}_${funcCounter++}_`);
    }

    models[Array.prototype.indexOf] = symbolicHook(
        (_f, base, args, _r) => state.isSymbolic(base),
        (_f, base, args, result) => {

            const searchTarget = state.asSymbolic(args[0]);
            const startIndex = args[1] ? state.asSymbolic(args[1]) : state.asSymbolic(0);

            let result_s = mkIndexSymbol('IndexOf');
           
            //The result is an integer -1 <= result_s < base.length
            state.pushCondition(ctx.mkGe(result_s, ctx.mkIntVal(-1)), true);
            state.pushCondition(ctx.mkGt(state.asSymbolic(base).getLength(), result_s), true);
            
            // either result_s is a valid index for the searchtarget or -1
            state.pushCondition(
                ctx.mkOr(
                    ctx.mkEq(ctx.mkSelect(state.asSymbolic(base), result_s), searchTarget), 
                    ctx.mkEq(result_s, ctx.mkIntVal(-1))
                ),
                true /* Binder */
            );
                
            // If result != -1 then forall 0 < i < result select base i != target
            const intSort = ctx.mkIntSort();
            const i = ctx.mkBound(0, intSort);
            const match_func_decl_name = mkFunctionName('IndexOf');
           
            const iLessThanResult = ctx.mkPattern([
                ctx.mkLt(i, result_s),
                ctx.mkGe(i, ctx.mkIntVal(0))
            ]);

            const matchInArrayBody = ctx.mkImplies(
                ctx.mkAnd(ctx.mkGe(i, ctx.mkIntVal(0)), ctx.mkLt(i, result_s)),
                ctx.mkNot(
                    ctx.mkEq(
                        ctx.mkSelect(state.asSymbolic(base), i),
                        searchTarget
                    )
                )
            );

            const noPriorUse = ctx.mkForAll([match_func_decl_name], intSort, matchInArrayBody, [iLessThanResult]);

            state.pushCondition(
                ctx.mkImplies(
                    ctx.mkGt(result_s, ctx.mkIntVal(-1)),
                    noPriorUse
                ),
                true
            );
            
            return new ConcolicValue(result, result_s);
        }
    );

    models[Array.prototype.includes] = symbolicHook(
        (_f, base, args, _r) => {
            const is_symbolic = state.isSymbolic(base);
            const is_well_formed =  typeof state.getConcrete(args[0]) == typeof state.getConcrete(base)[0];
            return is_symbolic && is_well_formed;
        },
        (_f, base, args, result) => {

            const searchTarget = state.asSymbolic(args[0]);

            const intSort = ctx.mkIntSort();
            const i = ctx.mkBound(0, intSort);

            const lengthBounds = ctx.mkAnd(
                ctx.mkGe(i, ctx.mkIntVal(0)),
                ctx.mkLt(i, state.asSymbolic(base).getLength())
            );
            
            const body = ctx.mkAnd(
                lengthBounds,
                ctx.mkEq(
                    ctx.mkSelect(state.asSymbolic(base), i),
                    searchTarget
                )
            );

            const iPattern = ctx.mkPattern([
                ctx.mkLt(i, state.asSymbolic(base).getLength()),
                ctx.mkGe(i, ctx.mkIntVal(0))
            ]);

            const func_decl_name = mkFunctionName('Includes');
            const result_s = ctx.mkExists([func_decl_name], intSort, body, [iPattern]);
            
            return new ConcolicValue(result, result_s);
        }
    );

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
    models[Function.prototype.apply] = ConcretizeIfSymbolic(0);
    models[Function.prototype.call] = ConcretizeIfSymbolic(0);

    /**
     * Secret _expose hooks for symbols.js
     */

    Object._expose = {};

    Object._expose.makeSymbolic = function() { return 'MakeSymbolic'; };
    Object._expose.notAnError = function() { return NotAnErrorException; };
    Object._expose.pureSymbol = function() { return 'PureSymbol'; }

    models[Object._expose.makeSymbolic] = symbolicHook(
        () => true,
        (_f, base, args, result) => { 
            Log.log(`Creating symbolic variable ${args[0]}`);
            return state.createSymbolicValue(args[0], args[1]);
        }
    );

    models[Object._expose.pureSymbol] = symbolicHook(
        () => true,
        (_f, base, args, result) => { 
            Log.log(`Creating pure symbolic variable ${args[0]}`);
            return state.createPureSymbol(args[0]);
        }
    );

    models[Object._expose.notAnError] = symbolicHook(
        () => true,
        () => NotAnErrorException
    );

    return models;
}

export default BuildModels;

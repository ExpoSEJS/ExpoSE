/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */


import ObjectHelper from "./Utilities/ObjectHelper";
import Log from "./Utilities/Log";
import Z3 from "z3javascript";
import Config from "./Config";
import NotAnErrorException from "./NotAnErrorException";
import { isNative } from "./Utilities/IsNative";
import { ConcolicValue } from "./Values/WrappedValue";

const find = Array.prototype.find;
const map = Array.prototype.map;

function DoesntMatch(l, r) {
	if (l == undefined) {
		const is_match = (r == "") || (r == undefined);
		return !is_match;
	} else {
		return l == r;
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

function Model() {
	this._models = [];

	this.add = function(fn, mdl) {
		this._models.push({ 
			fn: fn,
			mdl: function() {
				return mdl.call(null, this, arguments);
			}
		});
	};

	this.get = function(fn) {
		const found = this._models.find(x => x.fn == fn);
		return found ? found.mdl : null;
	};
}

/**
 * Builds a set of function models bound to a given SymbolicState
 */
function BuildModels(state) {
	const ctx = state.ctx;
	const model = new Model();

	function ConcretizeIfNative(f) {
		return function(base, args) {

			base = state.getConcrete(base);
			const fn_model = model.get(base);
			const is_native = !fn_model && isNative(base);

			if (is_native) {
				Log.logMid("WARNING: Concretizing model for " + f.toString() + " " + JSON.stringify(base));
				const concretized = state.concretizeCall(f, base, args, false);
				base = concretized.base;
				args = concretized.args;
			}

			return f.apply(fn_model || base, args);
		};
	}

	function coerceToString(symbol) {
        
		if (typeof state.getConcrete(symbol) !== "string") {
			Log.log(`TODO: Concretizing non string input ${symbol} reduced to ${state.getConcrete(symbol)}`);
			return new ConcolicValue(
				state.getConcrete(symbol),
				state.asSymbolic("" + state.getConcrete(symbol))
			);
		}

		return symbol;
	}


	/**
     * Symbolic hook is a helper function which builds concrete results and then,
     * if condition() -> true executes a symbolic helper specified by hook
     * Both hook and condition are called with (context (SymbolicExecutor), f, base, args, result)
     *
     * A function which makes up the new function model is returned
     */
	function symbolicHook(f, condition, hook, concretize = true, featureDisabled = false) {
		return function(base, args) {

			let thrown = undefined;
            
			let result;

			//Defer throw until after hook has run
			try {
				const c_base = concretize ? state.getConcrete(base) : base;
				const c_args = concretize ? map.call(args, arg => state.getConcrete(arg)) : args;
				result = f.apply(c_base, c_args);
			} catch (e) {
				thrown = e;
			}

			Log.logMid(`Symbolic Testing ${f.name} with base ${ObjectHelper.asString(base)} and ${ObjectHelper.asString(args)} and initial result ${ObjectHelper.asString(result)}`);

			if (!featureDisabled && condition(base, args)) {
				result = hook(base, args, result);
			}

			Log.logMid(`Result: ${"" + result} Thrown: ${"" + thrown}`);

			if (thrown) {
				throw thrown;
			}

			return result;
		};
	}

	//Hook for regex methods, will only hook if regex is enabled
	function symbolicHookRe(f, condition, hook) {
		return symbolicHook(f, condition, function() {
			//Intercept the hook to do regex stats
			state.stats.seen("Regex Function Model");
			return hook.apply(this, arguments);
		}, true, !Config.regexEnabled);
	}

	function NoOp(f) {
		return function(base, args) {
			Log.logMid(`NoOp ${f.name} with base ${ObjectHelper.asString(base)} and ${ObjectHelper.asString(args)}`);
			return f.apply(base, args);
		};
	}

	function BuildArrayModels(state, ctx, model) {

		let indexOfCounter = 0;

		function mkIndexSymbol(op) {
			return ctx.mkIntVar(`_${op}_${indexOfCounter++})`);
		}
        
		let funcCounter = 0;
        
		function mkFunctionName(fn) {
			return ctx.mkStringSymbol(`_fn_${fn}_${funcCounter++}_`);
		}

		model.add(Array.prototype.push, function(base, args) {

			const is_symbolic = state.isSymbolic(base);
			const args_well_formed = state.getConcrete(base) instanceof Array
                    && state.arrayType(base) == typeof(state.getConcrete(args[0]));

			if (is_symbolic && args_well_formed) {
				Log.log("Push symbolic prototype");
				const array = state.asSymbolic(base);
				const value = state.asSymbolic(args[0]);

				const oldLength = array.getLength();
				const newLength = ctx.mkAdd(oldLength, ctx.mkIntVal(1));

				state.getConcrete(base).push(state.getConcrete(args[0]));
				state.updateSymbolic(base, array.setField(oldLength, value).setLength(newLength));
				return args[0];
			} else {

				//TODO: Check that this mechanism for removing-symbolicness actually works
				//TODO: The goal here is to concretize this result from here-on in as the concrete model might be non-homogonous
				if (state.isSymbolic(base)) {
					state.updateSymbolic(base, null);
				}

				state.getConcrete(base).push(args[0]);
				return args[0];
			}    
		});

		model.add(Array.prototype.pop, function(base, args) {

			const is_symbolic = state.isSymbolic(base);
			const args_well_formed = state.getConcrete(base) instanceof Array
                    && state.arrayType(base) == typeof(state.getConcrete(args[0]));

			Log.log("TODO: Push prototype is not smart enough to decide array type");
			if (is_symbolic && args_well_formed) {
				Log.log("Push symbolic prototype");
				const array = state.asSymbolic(base);

				const oldLength = array.getLength();
				const newLength = ctx.mkAdd(oldLength, ctx.mkIntVal(-1));

				const result = new ConcolicValue(state.getConcrete(base).pop(), state.getField(oldLength));
				state.updateSymbolic(base, array.setLength(newLength));
				return result;
			} else {
                
				//TODO: Check this works (See push)
				if (state.isSymbolic(base)) {
					state.updateSymbolic(base, null);
				}

				return state.getConcrete(base).pop();
			}    
		});

		model.add(Array.prototype.indexOf, symbolicHook(
			Array.prototype.indexOf,
			(base, _args) => {
				const is_symbolic = state.isSymbolic(base) && state.getConcrete(base) instanceof Array;
				return is_symbolic;
			},
			(base, args, result) => {

				const searchTarget = state.asSymbolic(args[0]);
				let result_s = mkIndexSymbol("IndexOf");

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
				const match_func_decl_name = mkFunctionName("IndexOf");
               
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
		));

		model.add(Array.prototype.includes, symbolicHook(
			Array.prototype.includes,
			(base, args) => {
				const is_symbolic = state.isSymbolic(base);
				const args_well_formed = state.getConcrete(base) instanceof Array
                        && state.arrayType(base) == typeof(state.getConcrete(args[0]));
				return is_symbolic && args_well_formed;
			},
			(base, args, result) => {

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

				const func_decl_name = mkFunctionName("Includes");
				const result_s = ctx.mkExists([func_decl_name], intSort, body, [iPattern]);
                
				return new ConcolicValue(result, result_s);
			}
		));
	}

	function BuildStringModels(state, ctx, model) {

		function EnableCaptures(regex, real, string_s) {
            
			if (!Config.capturesEnabled) {
				Log.log("Captures disabled - potential loss of precision");
			}

			Log.logMid("Captures Enabled - Adding Implications");

			const implies = ctx.mkImplies(ctx.mkSeqInRe(string_s, regex.ast),
				ctx.mkEq(string_s, regex.implier));

			//Mock the symbolic conditional if (regex.test(/.../) then regex.match => true)
			regex.assertions.forEach(binder => state.pushCondition(binder, true));
			state.pushCondition(implies, true);
		}

		function BuildRefinements(regex, real, string_s) {

			if (!(Config.capturesEnabled && Config.refinementsEnabled)) {
				Log.log("Refinements disabled - potential accuracy loss");
				return {
					trueCheck: [],
					falseCheck: []
				};
			}
            
			Log.log("Refinements Enabled - Adding checks");

			state.stats.seen("Regex Which May Need Checks");

			function CheckCorrect(model) {
				const real_match = real.exec(model.eval(string_s).asConstant(model));
				const sym_match = regex.captures.map(cap => model.eval(cap).asConstant(model));

				Log.logMid(`Regex sanity check ${JSON.stringify(real_match)} vs ${JSON.stringify(sym_match)}`);
                    
				const is_correct = real_match && !Exists(real_match, sym_match, DoesntMatch);
                
				state.stats.seen("Regex Checks");	
                
				if (!is_correct) {
					state.stats.seen("Failed Regex Checks");
				}

				return is_correct;
			}

			function CheckFailed(model) {
				const is_failed = !real.test(model.eval(string_s).asConstant(model));
				state.stats.seen("Regex Checks");
				if (!is_failed) {
					state.stats.seen("Failed Regex Checks"); 
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

				real_match = real_match.map(match => match || "");

				const query_list = regex.captures.map(
					(cap, idx) => ctx.mkEq(ctx.mkString(real_match[idx]), cap)
				);

				return [new Z3.Query(query.exprs.slice(0).concat(query_list), [])];
			});

			const CheckNotIn = Z3.Check(CheckFailed, (query, model) => {
				const existing_queries = query.expr.slice(0);
				const not_eq = ctx.mkNot(ctx.mkEq(string_s, model.eval(string_s)));
				return [new Z3.Query(existing_queries.concat([not_eq]))];
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

			if (real.global) {
				result = String.prototype.secret_global_match.call(string, real);
			} else {

				const regex = Z3.Regex(ctx, real);
				const in_regex = RegexTest(regex, real, string, true);
				state.conditional(in_regex);

				if (Config.capturesEnabled && state.getConcrete(in_regex)) {
					const rewrittenResult = result.map((current_c, idx) => {
						//TODO: This is really nasty, current_c should be a
						const current_rewrite = current_c === undefined ? "" : current_c;
						return new ConcolicValue(current_rewrite, regex.captures[idx]);
					});

					rewrittenResult.index = new ConcolicValue(result.index, regex.startIndex);
					rewrittenResult.input = string;

					result = rewrittenResult;
				}
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

		function substringHelper(base, args, result) {
			state.stats.seen("Symbolic Substrings");

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
				len = maxLength;
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
		function rewriteTestSticky(real, target, _result) {
            
			if (real.sticky || real.global) {

				state.stats.seen("Sticky / Global Regex");

				const lastIndex = real.lastIndex;
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

					const currentIndex = state.binary("+", lastIndex, matchResult.index);
					real.lastIndex = state.binary("+", currentIndex, matchLength);
					return true;
				}
            
				return false;
			} else {
				return RegexTest(Z3.Regex(ctx, real), real, target, false);
			}
		}

		/**
         * Stubs string constructor with our (flaky) coerceToString fn
         */
		model.add(String, symbolicHook(
			String,
			(_base, args) => state.isSymbolic(args[0]),
			(_base, args, _result) => coerceToString(args[0])
		));

		const substrModel = symbolicHook(
			String.prototype.substr,
			(base, args) => typeof state.getConcrete(base) === "string" && (state.isSymbolic(base) || state.isSymbolic(args[0]) || state.isSymbolic(args[1])),
			substringHelper
		);

		model.add(String.prototype.substr, substrModel);
		model.add(String.prototype.substring, substrModel);
		model.add(String.prototype.slice, substrModel);

		model.add(String.prototype.charAt, symbolicHook(
			String.prototype.charAt,
			(base, args) => {
				const is_symbolic = (state.isSymbolic(base) || state.isSymbolic(args[0]));
				const is_well_formed = typeof state.getConcrete(base) === "string" && typeof state.getConcrete(args[0]) === "number";
				return is_symbolic && is_well_formed;
			},
			(base, args, result) => {
				const index_s = ctx.mkRealToInt(state.asSymbolic(args[0]));
				const char_s = ctx.mkSeqAt(state.asSymbolic(base), index_s);
				return new ConcolicValue(result, char_s);
			}
		));

		model.add(String.prototype.concat, symbolicHook(
			String.prototype.concat,
			(base, args) => state.isSymbolic(base) || find.call(args, arg => state.isSymbolic(arg)),
			(base, args, result) => {
				const arg_s_list = Array.prototype.map.call(args, arg => state.asSymbolic(arg));
				const concat_s = ctx.mkSeqConcat([state.asSymbolic(base)].concat(arg_s_list));
				return new ConcolicValue(result, concat_s);
			}
		));

		model.add(String.prototype.indexOf, symbolicHook(
			String.prototype.indexOf,
			(base, args) => typeof state.getConcrete(base) === "string" && (state.isSymbolic(base) || state.isSymbolic(args[0]) || state.isSymbolic(args[1])),
			(base, args, result) => {
				const off_real = args[1] ? state.asSymbolic(args[1]) : state.asSymbolic(0);
				const off_s = ctx.mkRealToInt(off_real);
				const target_s = state.asSymbolic(coerceToString(args[0]));
				const seq_index = ctx.mkSeqIndexOf(state.asSymbolic(base), target_s, off_s);
				return new ConcolicValue(result, seq_index);
			}
		));

		model.add(String.prototype.search, symbolicHookRe(
			String.prototype.search,
			(base, args) => state.isSymbolic(base) && args[0] instanceof RegExp,
			(base, args, result) => RegexSearch(args[0], base, result)
		));

		model.add(String.prototype.match, symbolicHookRe(
			String.prototype.match,
			(base, args) => state.isSymbolic(base) && args[0] instanceof RegExp,
			(base, args, result) => RegexMatch(args[0], base, result)
		));

		model.add(RegExp.prototype.exec, symbolicHookRe(
			RegExp.prototype.exec,
			(base, args) => base instanceof RegExp && state.isSymbolic(args[0]),
			(base, args, result) => RegexMatch(base, args[0], result)
		));

		model.add(RegExp.prototype.test, symbolicHookRe(
			RegExp.prototype.test,
			(_base, args) => state.isSymbolic(args[0]),
			(base, args, result) => rewriteTestSticky(base, coerceToString(args[0]), result)
		));

		//Replace model for replace regex by string. Does not model replace with callback.
		model.add(String.prototype.replace, symbolicHookRe(
			String.prototype.replace,
			(base, args) => state.isSymbolic(base) && args[0] instanceof RegExp && typeof args[1] === "string",
			(base, args, _result) => state.getConcrete(base).secret_replace.apply(base, args)
		));

		model.add(String.prototype.split, symbolicHookRe(
			String.prototype.split,
			(base, args) => state.isSymbolic(base) && args[0] instanceof RegExp,
			(base, args, _result) => state.getConcrete(base).secret_split.apply(base, args)
		));

		model.add(String.prototype.repeat, symbolicHook(
			String.prototype.repeat,
			(base, a) => state.isSymbolic(base) || state.isSymbolic(a[0]) 
                && typeof(state.getConcrete(base)) == "string"
                && typeof(state.getConcrete(a[0])) == "number",
			(base, a, result) => {

				const num_repeats = state.asSymbolic(a[0]);
				state.pushCondition(ctx.mkGe(num_repeats, ctx.mkIntVal(0)));

				const result_s = ctx.mkApp(state.stringRepeat, [state.asSymbolic(base), ctx.mkRealToInt(num_repeats)]);
				return new ConcolicValue(result, result_s); 
			}
		));

		function trimLeftSymbolic(base_s) {
			const whiteLeft = ctx.mkApp(state.whiteLeft, [base_s, ctx.mkIntVal(0)]);
			const strLen = base_s.getLength();
			const totalLength = ctx.mkSub(strLen, whiteLeft);
			return ctx.mkSeqSubstr(base_s, whiteLeft, totalLength);
		}

		function trimRightSymbolic(base_s) {
			const strLen = base_s.getLength();
			const whiteRight = ctx.mkApp(state.whiteRight, [base_s, strLen]);
			const totalLength = ctx.mkAdd(whiteRight, ctx.mkIntVal(1));
			return ctx.mkSeqSubstr(base_s, ctx.mkIntVal(0), totalLength);
		}

		model.add(String.prototype.trimRight, symbolicHook(
			String.prototype.trim,
			(base, _a) => state.isSymbolic(base) && typeof(state.getConcrete(base).valueOf()) === "string",
			(base, _a, result) => {
				const base_s = state.asSymbolic(base);
				return new ConcolicValue(result, trimRightSymbolic(base_s));
			}
		));

		model.add(String.prototype.trimLeft, symbolicHook(
			String.prototype.trim,
			(base, _a) => state.isSymbolic(base) && typeof(state.getConcrete(base).valueOf()) === "string",
			(base, _a, result) => {
				const base_s = state.asSymbolic(base);
				return new ConcolicValue(result, trimLeftSymbolic(base_s));
			}
		));

		model.add(String.prototype.trim, symbolicHook(
			String.prototype.trim,
			(base, _a) => state.isSymbolic(base) && typeof(state.getConcrete(base).valueOf()) === "string",
			(base, _a, result) => {
				const base_s = state.asSymbolic(base);
				return new ConcolicValue(result, trimRightSymbolic(trimLeftSymbolic(base_s)));
			}
		));

		model.add(String.prototype.toLowerCase, symbolicHook(
			String.prototype.toLowerCase,
			(base, _a) => state.isSymbolic(base) && typeof(state.getConcrete(base).valueOf()) === "string",
			(base, _a, result) => {
				base = coerceToString(base);

				state.pushCondition(
					ctx.mkSeqInRe(state.asSymbolic(base),
						Z3.Regex(ctx, /^[^A-Z]+$/).ast),
					true
				);

				return new ConcolicValue(result, state.asSymbolic(base));
			}
		));

	}

	function BuildMathModels(state, ctx, model) {

		/** 
         * TODO: Floor and Ceil should -1 or +1 if args[0] > or < the result
         */
        
		model.add(Math.floor, symbolicHook(
			Math.floor,
			(base, args) => state.isSymbolic(args[0]),
			(base, args, r) => {
				const intArg = ctx.mkRealToInt(state.asSymbolic(args[0]));
				const floored = ctx.mkIntToReal(intArg);
				return new ConcolicValue(r, floored);
			}
		));

		model.add(Math.ceil, symbolicHook(
			Math.floor,
			(base, args) => state.isSymbolic(args[0]),
			(base, args, r) => {
				const intArg = ctx.mkRealToInt(state.asSymbolic(args[0]));
				const floored = ctx.mkIntToReal(intArg);
				return new ConcolicValue(r, floored);
			}
		));

		model.add(Math.round, symbolicHook(
			Math.floor,
			(base, args) => state.isSymbolic(args[0]),
			(base, args, r) => {
				const intArg = ctx.mkRealToInt(state.asSymbolic(args[0]));
				const floored = ctx.mkIntToReal(intArg);
				return new ConcolicValue(r, floored);
			}
		));

		model.add(Math.abs, symbolicHook(
			Math.abs,
			(base, args) => state.isSymbolic(args[0]),
			(base, args, r) => {
				const arg_s = state.asSymbolic(args[0]);
				return new ConcolicValue(r, ctx.mkIte(ctx.mkLt(arg_s, state.asSymbolic(0)), ctx.mkUnaryMinus(arg_s), arg_s));
			}
		));

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
	}

	BuildMathModels(state, ctx, model);
	BuildStringModels(state, ctx, model);
	BuildArrayModels(state, ctx, model);
    
	model.add(Array.prototype.keys, NoOp(Array.prototype.keys));
	model.add(Array.prototype.concat, NoOp(Array.prototype.concat));
	model.add(Array.prototype.forEach, NoOp(Array.prototype.forEach));
	model.add(Array.prototype.filter, NoOp(Array.prototype.filter));
	model.add(Array.prototype.map, NoOp(Array.prototype.map));
	model.add(Array.prototype.shift, NoOp(Array.prototype.shift));
	model.add(Array.prototype.unshift, NoOp(Array.prototype.unshift));
	model.add(Array.prototype.fill, NoOp(Array.prototype.fill));

	//TODO: Test IsNative for apply, bind & call
	model.add(Function.prototype.apply, ConcretizeIfNative(Function.prototype.apply));
	model.add(Function.prototype.call, ConcretizeIfNative(Function.prototype.call));
	model.add(Function.prototype.bind, ConcretizeIfNative(Function.prototype.bind));

	/**
     * Models for methods on Object
     */
	model.add(Object, function(base, args) {
		const concrete = state.concretizeCall(Object, base, args, false);
		let result = Object.apply(concrete.base, concrete.args);

		if (!(concrete.args[0] instanceof Object) && state.isSymbolic(args[0])) {
			result = new ConcolicValue(result, state.asSymbolic(args[0]));
		}

		return result;
	});

	/**
     * Secret _expose hooks for symbols.js
     */

	Object._expose = {};
	Object._expose.makeSymbolic = function(name, initial) { return state.createSymbolicValue(name, initial); };
	Object._expose.notAnError = function() { return NotAnErrorException; };
	Object._expose.pureSymbol = function(name) { return state.createPureSymbol(name); };

	return model;
}

export default BuildModels;

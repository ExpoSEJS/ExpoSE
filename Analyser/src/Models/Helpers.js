import Config from "../Config";
import { ConcolicValue } from "../Values/WrappedValue";

const map = Array.prototype.map;

export default function(state, ctx) {

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

	function substringHelper(base, args) {
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

		return new ConcolicValue(state.getConcrete(base).substring(state.getConcrete(args[0])), result_s);
	}

	return {
		symbolicHook: symbolicHook,
		ConcretizeIfNative: ConcretizeIfNative,
		coerceToString: coerceToString,
		symbolicHookRe: symbolicHookRe,
		NoOp: NoOp,
		substring: substringHelper
	};
}

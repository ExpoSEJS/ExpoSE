import Config from "../Config";

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

	return {
		symbolicHook: symbolicHook,
		DoesntMatch: DoesntMatch,
		Exists: Exists,
		ConcretizeIfNative: ConcretizeIfNative,
		coerceToString: coerceToString,
		symbolicHookRe: symbolicHookRe,
		NoOp: NoOp
	};
}

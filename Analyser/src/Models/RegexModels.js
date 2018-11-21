import Z3 from "z3javascript";
import { ConcolicValue } from "../Values/WrappedValue";
import Config from "../Config";
import Log from "../Utilities/Log";

export default function(state, ctx, model, helpers) {

	const symbolicHookRe = helpers.symbolicHookRe;
	const coerceToString = helpers.coerceToString;

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
			//falseCheck: [CheckNotIn]
		};
	}

	function RegexBuiltInExec(regex, string) {

		if (real.sticky || real.global) {
			//Cut at regex.lastIndex
		}



	}

	function RegexTest(regex, real, string, careAboutCaptures) {

		if (real.sticky || real.global) {

		}

		const in_s = ctx.mkSeqInRe(
				state.asSymbolic(string),
				regex.ast
				);

		const in_c = real.test(state.getConcrete(string));

		if (regex.backreferences || careAboutCaptures) {
			EnableCaptures(regex, real, state.asSymbolic(string));
			const checks = BuildRefinements(regex, real, state.asSymbolic(string));
			in_s.checks.trueCheck = checks.trueCheck;
			in_s.checks.falseCheck = checks.falseCheck;
		}

		return new ConcolicValue(in_c, in_s);
	}

	function RegexExec(real, string, result) {
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

		return result;
	}

	function RegexMatch(real, string, result) {

		if (real.global) {

			let results = [];

			while (true) {
				const next = RegexExec(real, string, result);
				results.push(next);
			}

			result = results; 
		} else {
			return RegexExec(real, string, result);
		}
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
		(base, args, result) => RegexExec(base, args[0], result)
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

}

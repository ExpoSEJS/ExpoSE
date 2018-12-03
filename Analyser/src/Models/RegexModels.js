import Z3 from "z3javascript";
import { ConcolicValue } from "../Values/WrappedValue";
import Config from "../Config";
import Log from "../Utilities/Log";

let isMatchCount = 0;

export default function(state, ctx, model, helpers) {

	const symbolicHookRe = helpers.symbolicHookRe;
	const coerceToString = helpers.coerceToString;

	function DoesntMatch(l, r) {
		if (l == undefined) {
			const is_match = (r == "") || (r == undefined);
			return !is_match;
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

	function EnableCaptures(regex, real, string_s) {

		if (!Config.capturesEnabled) {
			Log.log("Captures disabled - potential loss of precision");
		}

		Log.logMid("Captures Enabled - Adding Implications");

		const implies = ctx.mkImplies(
				ctx.mkSeqInRe(string_s, regex.ast),
				ctx.mkEq(string_s, regex.implier)
		);

		//Mock the symbolic conditional if (regex.test(/.../) then regex.match => true)
		regex.assertions.forEach(binder => state.pushCondition(binder, true));
		state.pushCondition(implies, true);
	}

	function BuildRefinements(regex, real, string_s, is_match_s) {

		if (!(Config.capturesEnabled && Config.refinementsEnabled)) {
			Log.log("Refinements disabled - potential accuracy loss");
			return [];
		}

		Log.log("Refinements Enabled - Adding checks");

		state.stats.seen("Regex Which May Need Checks");

		//TODO: This is a workaround as calling asConstant on is_match_s doesn't work
		//Remove when we get a reply from the Z3 guys
		const isMatch =  ctx.mkBoolVar('IsMatch_' + real + '_' + isMatchCount++);
		state.pushCondition(ctx.mkEq(is_match_s, isMatch), true);

		function CheckCorrect(model) {
			if (model.eval(isMatch).asConstant(model)) { //Only apply this check if str.in.re .... was meant to be true

				state.stats.seen("Regex Checks");

				const real_match = real.exec(model.eval(string_s).asConstant(model));
				const sym_match = regex.captures.map(cap => model.eval(cap).asConstant(model));

				Log.logMid(`Regex sanity check ${JSON.stringify(real_match)} vs ${JSON.stringify(sym_match)}`);
				const is_correct = real_match && !Exists(real_match, sym_match, DoesntMatch);

				if (!is_correct) {
					state.stats.seen("Failed Regex Checks");
				}

				return is_correct;
			} else {
				return true;
			}
		}

		function CheckFailed(model) {
			if (!model.eval(isMatch).asConstant(model)) {
				state.stats.seen("Regex Checks");

				const is_failed = !real.test(model.eval(string_s).asConstant(model));

				if (!is_failed) {
					state.stats.seen("Failed Regex Checks"); 
				}

				return is_failed;
			} else {
				return true;
			}
		}

		const NotMatch = Z3.Check(CheckCorrect, (query, model) => {

			const not = ctx.mkNot(
				ctx.mkEq(string_s, ctx.mkString(model.eval(string_s).asConstant(model)))
			);

			return [
				new Z3.Query(query.exprs.slice(0).concat([not]), [CheckFixed, NotMatch])
			];
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
			const not = ctx.mkNot(ctx.mkEq(string_s, ctx.mkString(model.eval(string_s).asConstant(model))));
			return [new Z3.Query(query.exprs.slice(0).concat([not]), [CheckNotIn])];
		});

		return [CheckFixed, NotMatch, CheckNotIn];
	}

	/** As an optimization we implement test differently, this allows us to not generated extra paths when not needed on usage **/
	function RegexpBuiltinTest(regex, string) {

		const is_match_c = regex.test(state.getConcrete(string));

		if (regex.sticky || regex.global) {
			stats.seen('Sticky (RegexBuiltinExec)');
			//Cut at regex.lastIndex
			string = models.get(String.prototype.substring)(string, [regex.lastIndex]);
		}

		const regexEncoded = Z3.Regex(ctx, regex);

		const is_match_s = ctx.mkSeqInRe(state.asSymbolic(string), regexEncoded.ast);

		EnableCaptures(regexEncoded, regex, state.asSymbolic(string));
		is_match_s.checks = BuildRefinements(regexEncoded, regex, state.asSymbolic(string), is_match_s);

		return {
			result: new ConcolicValue(is_match_c, is_match_s),
			encodedRegex: regexEncoded,
		}
	}

	function RegexpBuiltinExec(regex, string) {
		const test = RegexpBuiltinTest(regex, string);
		state.conditional(test.result); //Fork on the str.in.re operation

		let result_c = regex.exec(state.getConcrete(string));

		if (Config.capturesEnabled && result_c) { //If str.in.re is success & captures are enabled then rewrite the capture results

			let nr = [];

			for (let i = 0; i < result_c.length; i++) {
				//TODO: Alias type symbolically for strings String = Undefined | String THIS IS BAD
				nr.push(new ConcolicValue(
					result_c[i] === undefined ? "" : result_c[i],
					test.encodedRegex.captures[i])
				);
			}

			//Start Index can only be computed when we have captures enabled
			nr.index = new ConcolicValue(result_c.index, test.encodedRegex.startIndex);
			nr.input = string;

			result_c = nr;
		}

		return {
			result: result_c,
			encodedRegex: test.encodedRegex
		};
	}

	function RegexpBuiltinMatch(regex, string) {

		if (regex.global) {

			//Remove g and y from regex
			const rewrittenRe = new RegExp(regex.source, regex.flags.replace(/"g|y"/g, "") + "y");

			let results = [];

			while (true) {
				const next = RegexpBuiltinExec(rewrittenRe, string);
				if (!next.result) {
					break;
				}
				results.push(next.result[0]);
			}

			return {
				result: results
			};

		} else {
			//Remove g and y from regex
			const rewrittenRe = new RegExp(regex.source, regex.flags.replace(/"g|y"/g, ""));
			return RegexpBuiltinExec(rewrittenRe, string);
		}
	}

	function RegexpBuiltinSearch(regex, string) {

		const test = RegexpBuiltinTest(regex, string);

		const search_in_re = ctx.mkIte(
			state.asSymbolic(test.result),
			test.encodedRegex.startIndex,
			state.constantSymbol(-1)
		);

		return {
			result: new ConcolicValue(
				state.getConcrete(string).search(regex),
				search_in_re
			)
		};

	}

	model.add(String.prototype.search, symbolicHookRe(
		String.prototype.search,
		(base, args) => state.isSymbolic(base) && args[0] instanceof RegExp,
		(base, args, _result) => RegexpBuiltinSearch(args[0], coerceToString(base)).result
	));

	model.add(String.prototype.match, symbolicHookRe(
		String.prototype.match,
		(base, args) => state.isSymbolic(base) && args[0] instanceof RegExp,
		(base, args, _result) => RegexpBuiltinMatch(args[0], coerceToString(base)).result
	));

	model.add(RegExp.prototype.exec, symbolicHookRe(
		RegExp.prototype.exec,
		(base, args) => base instanceof RegExp && state.isSymbolic(args[0]),
		(base, args, _result) => RegexpBuiltinExec(base, coerceToString(args[0])).result
	));

	model.add(RegExp.prototype.test, symbolicHookRe(
		RegExp.prototype.test,
		(base, args) => base instanceof RegExp && state.isSymbolic(args[0]),
		(base, args, _result) => RegexpBuiltinTest(base, coerceToString(args[0])).result
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

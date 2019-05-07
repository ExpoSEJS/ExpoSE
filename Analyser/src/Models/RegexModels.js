import { ConcolicValue } from "../Values/WrappedValue";
import Config from "../Config";
import Log from "../Utilities/Log";
import External from "../External";
import Z3 from "z3javascript";

let isMatchCount = 0;

export default function(state, ctx, model, helpers) {

	const coerceToString = helpers.coerceToString;

	//Hook for regex methods, will only hook if regex is enabled
	function symbolicHookRe(f, condition, hook) {
		const runMethod = helpers.runMethod;
		return function(base, args) {
			if (Config.regexEnabled && condition(base, args)) {
				return hook(base, args);
			} else {
				const [result, thrown] = runMethod(f, base, args);
				if (thrown) {
					throw thrown;
				}
				return result;
			}
		}
	}

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

		//The refinements operate on the remainder of the string so we no longer care about the sticky / global rules
		real = new RegExp(real.source, real.flags.replace(/y|g/g, ""));

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
				Log.log(`WARN: Broken regex detected ${regex.ast.toString()} vs ${real} in ${model.eval(string_s).asConstant(model)}`);
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

		let currentLastIndex = regex.lastIndex;
		regex.lastIndex = state.getConcrete(regex.lastIndex);

		const is_match_c = regex.test(state.getConcrete(string));

		if (regex.sticky || regex.global) {
			//Cut at regex.lastIndex
			state.stats.seen('Sticky (RegexBuiltinExec)');
			string = model.get(String.prototype.substring).call(string, currentLastIndex);
			if (!regex.source[0] != '^') {
				Log.log("In Sticky Mode We Insert ^");
				regex = new RegExp('^' + regex.source, regex.flags);
			}
		}

    state.stats.seen('Regex Encoded');
		const regexEncoded = Z3.Regex(ctx, regex);
		const is_match_s = ctx.mkSeqInRe(state.asSymbolic(string), regexEncoded.ast);

    console.log(`|REGEX ENCODING| exec(${state.asSymbolic(string).toString()}) -> (${regexEncoded.captures.reduce((last, capture, idx) => last + (idx > 0 ? ',' : '') + capture.toString(), '')})`);

		EnableCaptures(regexEncoded, regex, state.asSymbolic(string));
		is_match_s.checks = BuildRefinements(regexEncoded, regex, state.asSymbolic(string), is_match_s);

		if (Config.capturesEnabled && (regex.sticky || regex.global)) {
			Log.log('Captures enabled - symbolic lastIndex enabled');

			regexEncoded.startIndex = ctx.mkAdd(
				state.asSymbolic(currentLastIndex),
				regexEncoded.startIndex
			);

			regex.lastIndex = new ConcolicValue(
				regex.lastIndex,
				ctx.mkIte(
					is_match_s,
					ctx.mkAdd(state.asSymbolic(currentLastIndex), regexEncoded.captures[0].getLength()),
					ctx.mkIntVal(0)
				)
			);
		}

		return {
			result: new ConcolicValue(is_match_c, is_match_s),
			encodedRegex: regexEncoded,
		}
	}

	function RegexpBuiltinExec(regex, string) {

    Log.logMid("RegexpExec Model");	
	
		//Preserve the lastIndex property
		let lastIndex = regex.lastIndex;
		const test = RegexpBuiltinTest(regex, string);
		regex.lastIndex = lastIndex;

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
			const rewrittenRe = new RegExp(regex.source, regex.flags.replace(/g|y/g, "") + "y");

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

		const rewrittenRe = new RegExp(regex.source, regex.flags.replace(/g|y/g, ""));
		const test = RegexpBuiltinTest(rewrittenRe, string);

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

	function RegexpBuiltinSplit(regex, string) {
 
		//Remove g and y from regex
		const re = new RegExp(regex.source, regex.flags.replace(/g|y/g, "") + "");

		let results = [];
		let lastIndex = 0;

		function rest() {
			return model.get(String.prototype.substring)
				.call(string, lastIndex);
		}

		//While there is still a match of regex in string add the area before it to results and
		//then increase lastIndex by the size of the match + its start index
		while (true) {

			//Grab the remaining portion of the string and call exec on it
			const next = RegexpBuiltinExec(re, rest()).result;

			//While matches remain extract the bit before the match, add that to the result, update lastIndex and step
			if (next) {

				const matchSize = new ConcolicValue(
					state.getConcrete(next[0]).length,
					state.asSymbolic(next[0]).getLength()
				);

				const wordsBeforeSplit = model.get(String.prototype.substring)
					.call(string, lastIndex, next.index);	
				
				results.push(wordsBeforeSplit);

				lastIndex = state.binary('+',
					lastIndex,
					state.binary('+', next.index, matchSize)
				);

			} else {
				break;
			}
		}

		//After we have exhausted all instances of the re in string push the remainder to the result
		results.push(rest());

		return {
			result: results
		};
	}


	function RegexpBuiltinReplace(regex, string, replacementString) {

		//Remove g and y from regex
		const rewrittenRe = new RegExp(regex.source, regex.flags.replace(/g/g, "") + "");

		if (regex.flags.includes('g')) {

			let replaced = true;
			
			//Global replace
			while (true) {
				const next = RegexpBuiltinReplace(rewrittenRe, string, replacementString);

				if (!next.replaced) {
					break;
				}

				replaced = true;
				string = next.result;
			}

			return {
				result: string,
				replaced: replaced
			};

		} else {
			
			//Single point replace
			const next = RegexpBuiltinExec(rewrittenRe, string).result;

			if (next) {

				//Find out the match size
				let matchSize = new ConcolicValue(state.getConcrete(next[0]).length, state.asSymbolic(next[0]).getLength());

				//Collect the parts before and after the match
				let lhs = model.get(String.prototype.substring).call(string, 0, next.index);
				let rhs = model.get(String.prototype.substring).call(string, state.binary('+', next.index, matchSize));

				if (typeof(state.getConcrete(replacementString)) === "function") {
					string = state.binary('+',
						lhs,
						state.binary('+',
							coerceToString(replacementString.apply(null, next)),
							rhs
						)
					);
				} else {
					
					let finalString;

					//Simple (NOT STANDARDS-COMPLAINT!!) substitution for replacement strings with things like $1, $2 in them
					if (state.getConcrete(replacementString).search(/\$[0-9]/) != -1) {
						Log.log('WARN: no support for symbolic replacement strings');
						let remaining = state.getConcrete(replacementString);
						finalString = "";

						let toreplace;

						while ((toreplace = /\$[0-9]/.exec(remaining))) {
							const before = remaining.substr(0, toreplace.index);
							const replaced = next[toreplace[0][1]];
							finalString = state.binary('+', finalString, state.binary('+', before, replaced));
							remaining = remaining.substr(toreplace.index + toreplace[0].length);
						}

						finalString = state.binary('+', finalString, remaining);
					} else { //Short circuit if there are no substitution strings
						finalString = replacementString;
					}

					string = state.binary('+', lhs, state.binary('+', finalString, rhs));
				}

				return {
					result: string,
					replaced: true
				};
			} else {
				return {
					result: string,
					replaced: false
				};
			}
		}
	}

	function shouldBeSymbolic(regex, string) {
		return regex instanceof RegExp && (state.isSymbolic(regex.lastIndex) || state.isSymbolic(string)); 
	}

	model.add(String.prototype.search, symbolicHookRe(
		String.prototype.search,
		(base, args) => shouldBeSymbolic(args[0], base),
		(base, args) => RegexpBuiltinSearch(args[0], coerceToString(base)).result
	));

	model.add(String.prototype.match, symbolicHookRe(
		String.prototype.match,
		(base, args) => shouldBeSymbolic(args[0], base),
		(base, args) => RegexpBuiltinMatch(args[0], coerceToString(base)).result
	));

	model.add(RegExp.prototype.exec, symbolicHookRe(
		RegExp.prototype.exec,
		(base, args) => shouldBeSymbolic(base, args[0]),
		(base, args) => RegexpBuiltinExec(base, coerceToString(args[0])).result
	));

	model.add(RegExp.prototype.test, symbolicHookRe(
		RegExp.prototype.test,
		(base, args) => shouldBeSymbolic(base, args[0]),
		(base, args) => RegexpBuiltinTest(base, coerceToString(args[0])).result
	));

	model.add(String.prototype.replace, symbolicHookRe(
		String.prototype.replace,
		(base, args) => shouldBeSymbolic(args[0], base) && (typeof(state.getConcrete(args[1])) === "string" || typeof(state.getConcrete(args[1])) === "function"),
		(base, args) => RegexpBuiltinReplace(args[0], base, args[1]).result 
	));

	model.add(String.prototype.split, symbolicHookRe(
		String.prototype.split,
		(base, args) => state.isSymbolic(base) && (args[0] instanceof RegExp || typeof(args[0]) === "string"),
		(base, args) => RegexpBuiltinSplit(args[0] instanceof RegExp ? args[0] : new RegExp(args[0]), base).result
	));


  /**
   * Occasionally (Thanks James....) it appears developers may resolve the Symbol for the match method rather than use the API. Most interpreters use the same instance of the method for all constructs so we can add a model by creating a new RegExp, extracting the default match symbol and adding that to the models.
   */

  const Template = /DEFAULT/;

	model.add(Template[Symbol.search], symbolicHookRe(
		Template[Symbol.search],
		(base, args) => shouldBeSymbolic(base, args[0]),
		(base, args) => RegexpBuiltinSearch(base, coerceToString(args[0])).result
	));

	model.add(Template[Symbol.exec], symbolicHookRe(
		Template[Symbol.exec],
		(base, args) => shouldBeSymbolic(base, args[0]),
		(base, args) => RegexpBuiltinExec(base, coerceToString(args[0])).result
	));

	model.add(Template[Symbol.match], symbolicHookRe(
		Template[Symbol.match],
		(base, args) => shouldBeSymbolic(base, args[0]),
		(base, args) => RegexpBuiltinExec(base, coerceToString(args[0])).result
	));

	model.add(Template[Symbol.replace], symbolicHookRe(
		Template[Symbol.replace],
		(base, args) => shouldBeSymbolic(base, args[0]) && (typeof(state.getConcrete(args[1])) === "string" || typeof(state.getConcrete(args[1])) === "function"),
		(base, args) => RegexpBuiltinReplace(base, args[0], args[1]).result
	));

}

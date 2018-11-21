export default function(state, ctx, model, helper) {

	const symbolicHook = helper.symbolicHook;
	const NoOp = helper.NoOp;

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

	model.add(Array.prototype.keys, NoOp(Array.prototype.keys));
	model.add(Array.prototype.concat, NoOp(Array.prototype.concat));
	model.add(Array.prototype.forEach, NoOp(Array.prototype.forEach));
	model.add(Array.prototype.filter, NoOp(Array.prototype.filter));
	model.add(Array.prototype.map, NoOp(Array.prototype.map));
	model.add(Array.prototype.shift, NoOp(Array.prototype.shift));
	model.add(Array.prototype.unshift, NoOp(Array.prototype.unshift));
	model.add(Array.prototype.fill, NoOp(Array.prototype.fill));
}

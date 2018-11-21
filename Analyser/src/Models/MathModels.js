export default function(state, ctx, model, helper) {

	const symbolicHook = helper.symbolicHook;

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

};

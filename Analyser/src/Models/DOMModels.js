import { ConcolicValue } from '../Values/WrappedValue';

export default function(state, ctx, models, helper) {
  if (typeof window !== "undefined") {
    models.add(Element.prototype.getAttribute, helper.NoOp(Element.prototype.getAttribute));
    models.add(Element.prototype.setAttribute, helper.NoOp(Element.prototype.setAttribute));
  }

	models.add(encodeURI, function(base, args) {
		for (var i = 0; i < args.length; i++) {
			console.log('EncURI args: ' + args[i].toString());
		}
		const result = new ConcolicValue(encodeURI.call(base, state.getConcrete(args[0])), state.asSymbolic(args[0]));
		console.log('Encode URI result: ' + result.toString());
		return result;
	});

	models.add(encodeURIComponent, function(base, args) {
		const result = new ConcolicValue(encodeURIComponent.call(base, state.getConcrete(args[0])), state.asSymbolic(args[0]));
		console.log('Encode URI Component: ' + result.toString());
		return result;
	});
}

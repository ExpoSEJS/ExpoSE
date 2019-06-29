import { ConcolicValue } from '../Values/WrappedValue';
import Log from '../Utilities/Log';

export default function(state, ctx, models, helper) {
  if (typeof window !== "undefined") {
    models.add(Element.prototype.getAttribute, helper.NoOp(Element.prototype.getAttribute));
    models.add(Element.prototype.setAttribute, helper.NoOp(Element.prototype.setAttribute));
  }

	models.add(encodeURI, function(base, args) {
		const result = new ConcolicValue(encodeURI.call(base, state.getConcrete(args[0])), state.asSymbolic(args[0]));
		Log.logMid('Encode URI result: ' + result.toString());
		return result;
	});

	models.add(encodeURIComponent, function(base, args) {
    if (state.isSymbolic(args[0])) {
      args[0] = helper.coerceToString(args[0]);
		  const result = new ConcolicValue(encodeURIComponent.call(base, state.getConcrete(args[0])), state.asSymbolic(args[0]));
	  	Log.logMid('Encode URI Component: ' + result.toString());
		  return result;
    }
	});
}

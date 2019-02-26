import { ConcolicValue } from '../Values/WrappedValue';

export default function(state, ctx, models, helper) {
  if (typeof window !== "undefined") {
    models.add(Element.prototype.getAttribute, helper.NoOp(Element.prototype.getAttribute));
    models.add(Element.prototype.setAttribute, helper.NoOp(Element.prototype.setAttribute));
  }

	models.add(encodeURI, function(base, args) {
		return new ConcolicValue(encodeURI(state.getConcrete(args[0])), state.asSymbolic(args[0]));
	});

	models.add(encodeURIComponent, models.get(encodeURI));
}

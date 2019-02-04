export default function(state, ctx, models, helper) {
  model.add(Element.prototype.getAttribute, helper.NoOp);
  model.add(Element.prototype.setAttribute, helper.NoOp);
}

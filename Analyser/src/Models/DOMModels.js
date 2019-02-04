export default function(state, ctx, models, helper) {
  models.add(Element.prototype.getAttribute, helper.NoOp);
  models.add(Element.prototype.setAttribute, helper.NoOp);
}

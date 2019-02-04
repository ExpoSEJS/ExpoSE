export default function(state, ctx, models, helper) {
  if (typeof window !== "undefined") {
    models.add(Element.prototype.getAttribute, helper.NoOp);
    models.add(Element.prototype.setAttribute, helper.NoOp);
  }
}

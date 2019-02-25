export default function(state, ctx, models, helper) {
  if (typeof window !== "undefined") {
    models.add(Element.prototype.getAttribute, helper.NoOp(Element.prototype.getAttribute));
    models.add(Element.prototype.setAttribute, helper.NoOp(Element.prototype.setAttribute));
  }

	models.add(encodeURI, function(base, args) {
		const replace = models.get(String.prototype.replace);

		const result = replace.call(args[0], /[^A-Za-z0-9;,/?:@&=+$-_.!~*'()#]/g, function(match) {
			return `%${state.getConcrete(match).charCodeAt(0)}`;
		});

		console.log('ENCODE_URI_EVENT:', result.toString());

		return result;
	});
}

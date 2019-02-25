export default function(state, ctx, model, helpers) {

	const ConcretizeIfNative = helpers.ConcretizeIfNative;

	//TODO: Test IsNative for apply, bind & call
	model.add(Function.prototype.apply, ConcretizeIfNative(Function.prototype.apply));
	model.add(Function.prototype.call, ConcretizeIfNative(Function.prototype.call));
	model.add(Function.prototype.bind, ConcretizeIfNative(Function.prototype.bind));
  model.add(console.log, function(base, args) {
		console.log.apply(base, args);
	});
}

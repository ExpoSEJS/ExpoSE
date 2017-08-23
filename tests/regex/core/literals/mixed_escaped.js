var x = symbolic X initial '';
var isIn = /^Hello(world)how are you\(today\)huh\?huh?$/.test(x);

if (isIn) {
	if (x != 'Helloworldhow are you(today)huh?hu' && x != 'Helloworldhow are you(today)huh?huh') {
		throw 'Unreachable';
	} else {
		throw 'Reachable';
	}
} else {
	throw 'Reachable';
}
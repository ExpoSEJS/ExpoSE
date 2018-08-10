var x = S$.symbol("X", '');
var isIn = /^Hello(world)how are you\(today\)huh\?huh?$/.test(x);

if (isIn) {
	if (x != 'Helloworldhow are you(today)huh?hu' && x != 'Helloworldhow are you(today)huh?huh') {
		throw 'Unreachable';
	} else {
		throw 'Reachable 1';
	}
} else {
	throw 'Reachable 2';
}

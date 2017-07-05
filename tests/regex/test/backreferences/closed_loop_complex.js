//Test a looped bref on a closed capture looped inside a capture

var x = symbolic X initial '';

assume x.length < 10;

if (/^(.)(\1b)+$/.test(x)) {

	for (var i = 1; i < x.length; i += 2) {
		if (x[i] != x[0]) throw 'Unreachable';
	}

	for (var i = 2; i < x.length; i += 2) {
		if (x[i] != 'b') throw 'Unreachable';
	}

	throw 'Reachable';
}
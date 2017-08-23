//Test a looped bref on a closed capture

var x = symbolic X initial '';

assume x.length < 10;

if (/^(.)\1+$/.test(x)) {
	for (var i = 1; i < x.length; i++) {
		if (x[i] != x[0]) throw 'Unreachable';
	}
	throw 'Reachable';
}
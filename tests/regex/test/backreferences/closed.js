//Test a single backreference of a closed capture group

var x = symbolic X initial '';

if (/^(.)\1$/.test(x)) {
	if (x[0] != x[1]) throw 'Unreachable';
	throw 'Reachable';
}
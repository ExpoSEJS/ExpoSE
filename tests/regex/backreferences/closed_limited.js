//Test a single backreference of a closed capture group

var x = S$.symbol("X", '');

if (/^(a)\1(a)\2$/.test(x)) {
	if (x[0] != x[1]) { throw 'Unreachable'; }
	if (x[2] != x[3]) { throw 'Unreachable'; }
	throw 'Reachable';
}
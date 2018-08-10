var x = S$.symbol("X", '');
var b = /(abc)(d)/.exec(x);

if (b) {
	if (b[0] != 'abcd') throw 'Unreachable';
	if (b[1] != 'abc') throw 'Unreachable';
	if (b[2] != 'd') throw 'Unreachable';

	throw 'Reachable';
}
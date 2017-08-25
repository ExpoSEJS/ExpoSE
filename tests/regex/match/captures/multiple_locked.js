var x = symbolic X initial '';
var regex = /(abc)(d)/
var b = x.match(regex);

if (b) {
	if (b[0] != 'abcd') throw 'Unreachable';
	if (b[1] != 'abc') throw 'Unreachable';
	if (b[2] != 'd') throw 'Unreachable';

	throw 'Reachable';
}
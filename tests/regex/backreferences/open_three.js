//Test modeling of looped references to open capture groups (Local captures)
var S$ = require('S$');
var x = S$.symbol("X", '');

if (/^(([a-z])\2)+(([1-9])\4)+$/.test(x)) {

	if (x == '11') {
		throw 'Unreachable';
	}

	if (x == 'ab') {
		throw 'Unreachable';
	}

	if (x == 'aa') {
		throw 'Unreachable';
	}

	if (x == 'zz') {
		throw 'Unreachable';
	}

	if (x == 'aa23') {
		throw 'Unreachable';
	}

	if (x == 'aa11') {
		throw 'Reachable';
	}

	if (x == 'aaaa11') {
		throw 'Reachable';
	}

	throw 'Reachable';
}
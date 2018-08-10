//Test modeling of looped references to open capture groups (Local captures)

var x = S$.symbol("X", '');

if (/^(([a-z])\2)+$/.test(x)) {

	if (x == '11') {
		throw 'Unreachable';
	}

	if (x == 'ab') {
		throw 'Unreachable';
	}

	if (x == 'aa') {
		throw 'Reachable';
	}

	if (x == 'zz') {
		throw 'Reachable';
	}

	throw 'Reachable';
}
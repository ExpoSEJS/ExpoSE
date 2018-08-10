//Test modeling of looped references to open capture groups (Local captures)

var x = S$.symbol("X", '');

if (/^((.)\2)+$/.test(x)) {

	if (x == 'aa') {
		throw 'Reachable';
	}

	if (x == 'bb') {
		throw 'Reachable';
	}

	if (x == 'cc') {
		throw 'Reachable';
	}

	throw 'Reachable';
}
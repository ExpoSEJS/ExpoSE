//Test modeling of looped references to open capture groups with a forced varying capture

var x = S$.symbol("X", '');

if (/^((.)\2)+$/.test(x)) {

	if (x == 'aabb') {
		throw 'Reachable';
	}

	if (x == 'HHeelloo') {
		throw 'Reachable';
	}

	if (x == 'aaaaaaaaaaaaaaaaaaaa') {
		throw 'Reachable';
	}

	if (x == 'aaaaa') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
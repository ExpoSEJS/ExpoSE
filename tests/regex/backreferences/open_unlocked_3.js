/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test modeling of looped references to open capture groups with a forced varying capture
var S$ = require('S$');
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

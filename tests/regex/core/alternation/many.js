/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

'use strict';
var S$ = require('S$');
var q = S$.symbol("q");

if (/^(a|b|c)(c|d)([a-z]|[0-9])$/.test(q)) {

	if (/^..$/.test(q)) {
		throw 'Unreachable';
	}

	if (q == 'ac3') {
		throw 'Reachable';
	}

	if (q == 'ccp') {
		throw 'Reachable';
	}

	if (q == 'ac4p') {
		throw 'Unreachable';
	}

	throw 'Reachable';

} else {

	if (q == 'ac5') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');
var x = S$.symbol("X", '');

var re3 = /^(?=(a|b|c)).$/;

if (re3.test(x)) {
	
	if (x == 'd') {
		throw 'Unreachable';
	}

	if (x == 'a') {
		throw 'Reachable';
	}

	if (x == 'b') {
		throw 'Reachable';
	}

	if (x == 'c') {
		throw 'Reachable';
	}

	throw 'Unreachable';
}

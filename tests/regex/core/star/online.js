/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');
var x = S$.symbol("X", '');

S$.assume(x.length < 10);

if (/^z*$/.test(x)) {
	
	if (x == '') {
		throw 'Reachable';
	}

	for (var i = 0; i < x.length; i++) {
		if (x[i] != 'z') {
			throw 'Unreachable';
		}
	}

	throw 'Reachable';
}

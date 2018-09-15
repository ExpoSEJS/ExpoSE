/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');
var x = S$.symbol("X", '');

var re = /^(?=([a-z])).$/;
var re2 = /^[0-9]$/;

if (re.test(x)) {
	
	if (re2.test(x)) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');
var x = S$.symbol("X", '');

var re = /^.(?=(a|b|c)).$/;

if (re.test(x)) {
	
	if (x.charAt(1) == 'd') {
		throw 'Unreachable';
	}

	if (x.charAt(1) == 'a') {
		throw 'Reachable';
	}

	if (x.charAt(1) == 'b') {
		throw 'Reachable';
	}

	if (x.charAt(1) == 'c') {
		throw 'Reachable';
	}

	throw 'Unreachable';
}

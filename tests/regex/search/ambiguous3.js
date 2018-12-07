/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests a simple string search

var S$ = require('S$');
var x = S$.symbol("X", '');

S$.assume(x.length < 7);

var b = /(a*)/;
var nl = x.search(b);

if (nl != -1) {

	//The first set of as should be the match, but if greediness is not enforced either will be accepted
	if (x == 'aaaa_a') {

		if (nl == 5) {
			throw 'Unreachable';
		}

		throw 'Reachable';
	}

	throw 'Reachable';
}

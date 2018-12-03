/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests a simple string search
var S$ = require('S$');

var x = S$.symbol("X", '');
var b = /abc/;
var nl = x.search(b);

if (nl > -1) {
	
	if (nl > 0) {
		//Locked by anchor to be 0
		throw 'Reachable';
	}

	throw 'Reachable';
}

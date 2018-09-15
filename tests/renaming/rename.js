/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test variable renaming scheme
var S$ = require('S$');
var x = S$.pureSymbol("X");
var y = S$.symbol("X", 10);

console.log('Wat');

if (x == 5 && x == y) {

} else {
	if (x == y) {
		throw 'Reachable 1';
	}

	throw 'Reachable 2';
}

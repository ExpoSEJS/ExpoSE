/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests a simple string search

var x = S$.symbol("X", '');
var b = /^(a|b)$/;
var nl = x.search(b);

if (nl != -1) {

	console.log('B is ' + b);
	
	if (nl == 3) {
		throw 'Unreachable';
	}

	if (x == 'a') throw 'Reachable';
	if (x == 'b') throw 'Reachable';

	throw 'Unreachable';
} else {
	//b not in x
	throw 'Reachable';
}

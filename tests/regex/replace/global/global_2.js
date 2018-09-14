/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests replace on a global regex

var x = S$.symbol("X", '');
var b = /(a|b)/g;

x = x.replace(b, 'q');

for (var i = 0; i < x.length; i++) {
	if (x[i] == 'a') {
		throw 'Unreachable';
	}

	if (x[i] == 'b') {
		throw 'Unreachable';
	}
}

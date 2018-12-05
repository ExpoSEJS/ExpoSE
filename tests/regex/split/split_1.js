/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests replace on a global regex

var S$ = require('S$');
var x = S$.symbol("X", '');
var b = /(a)/;

S$.assume(x.length < 5);

x = x.split(b);

if (x.length == 2) {

	if (x[0] == 'hello') {
		throw 'Unreachable'; //Broken by the assumption on string length
	}

	if (x[1] == 'wh') {
		throw 'Reachable';
	}

	if (x[0] == 'w') {
		throw 'Reachable';
	}
}

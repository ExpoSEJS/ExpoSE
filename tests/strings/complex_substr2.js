/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');
var x = S$.symbol("X", "hello");

S$.assume(x.length == 5);

if (x.substr(1, 1) == "w") {
	throw 'Reachable';
}

if (x.substr(1) == "what") {
	throw 'Unreachable';
}

if (x.substr(1) == "phat") {
	throw 'Reachable 2';
}

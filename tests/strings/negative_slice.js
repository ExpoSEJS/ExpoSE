/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');
var x = S$.symbol("X", "hello");

S$.assume(x.length == 5);

console.log('Sliced: ', x.slice(2));

if (x.slice(1, 1) == "w") {
	throw 'Unreachable';
}

if (x.slice(1) == "what") {
	throw 'Reachable 1';
}

if (x.slice(1) == "phat") {
	throw 'Reachable 2';
}

if (x.slice(-1) == "w") {
	throw 'Reachable 3';
}

if (x.slice(-5, 3) == "por") {
	throw 'Reachable 4';
}

if (x.slice(-3, 8) == "por") {
	throw 'Reachable 5';
}

if (x.slice(-5, 4) == "por") {
	throw 'Unreachable';
}

if (x.slice(-1) == "what") {
	throw 'Unreachable';
}

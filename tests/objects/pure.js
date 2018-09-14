/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');
var test = S$.pureSymbol('X');

if (test.hello == 'what') {
	throw 'Reachable';
}

test.hello = 'what';

if (test.hello != 'what') {
	throw 'Unreachable';
}

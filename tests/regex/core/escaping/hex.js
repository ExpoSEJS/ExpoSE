/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');
var x = S$.symbol("X", '');

if (/^\xFF$/.test(x)) {
	if (x != '\xFF') throw 'Unreachable';
	throw 'Reachable';
}

if (/^\xEF$/.test(x)) {
	if (x != '\xEF') throw 'Unreachable';
	throw 'Reachable';
}

if (/^\0$/.test(x)) {
	if (x == '\x00') throw 'Reachable';
	throw 'Unreachable';
}

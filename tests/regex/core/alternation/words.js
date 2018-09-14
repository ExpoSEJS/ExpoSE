/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');
var x = S$.symbol("X", '');

if (/^Hello|Goodbye|Whats Up$/.test(x)) {
	if (x == 'Hello') throw 'Reachable';
	if (x == 'Goodbye') throw 'Reachable';
	if (x == 'Whats Up') throw 'Reachable';
	throw 'Unreachable';
}

throw 'Reachable';

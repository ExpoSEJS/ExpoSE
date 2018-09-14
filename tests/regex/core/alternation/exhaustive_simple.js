/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Simple alternation test
var S$ = require('S$');
var x = S$.symbol("X", '');

if (/^(a|b|hello|dog)$/.test(x)) {
	if (x == 'a') throw 'Reachable';
	if (x == 'b') throw 'Reachable';
	if (x == 'hello') throw 'Reachable';
	if (x == 'dog') throw 'Reachable';
	throw 'Unreachable';
}

throw 'Reachable';

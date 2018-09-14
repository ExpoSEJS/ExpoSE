/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');
var x = S$.symbol("X", '');
var b = /(abc)(d)/.exec(x);

if (b) {
	if (b[0] != 'abcd') throw 'Unreachable';
	if (b[1] != 'abc') throw 'Unreachable';
	if (b[2] != 'd') throw 'Unreachable';

	throw 'Reachable';
}

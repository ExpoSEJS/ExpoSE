/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test a single backreference of a closed capture group
var S$ = require('S$');
var x = S$.symbol("X", '');

if (/^([ab])\1([ab])\2([ab])\1$/.test(x)) {
	if (x == 'aabbba') throw 'Reachable';
	if (x == 'abaaaa') throw 'Unreachable';
	throw 'Reachable';
}

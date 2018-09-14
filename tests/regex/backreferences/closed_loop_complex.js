/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test a looped bref on a closed capture looped inside a capture
var S$ = require('S$');
var x = S$.symbol("X", '');

if (/^(.)(\1b)+$/.test(x)) {

	if (x == 'aab') {
		throw 'Reachable';
	}

	throw 'Reachable';
}

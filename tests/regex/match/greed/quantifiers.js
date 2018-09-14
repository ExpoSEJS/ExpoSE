/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test greedyness brought on by ambiguities in quantifiers
var S$ = require('S$');
var x = S$.symbol("X", '');
var regex = /^(hello)+(.+)$/;
var b = x.match(regex);

if (b) {
	if (b[1].length < b[2].length) throw 'Unreachable';
	if (b[2].length > 1) throw 'Unreachable';
	if (b[2] == 'hello') throw 'Unreachable';
	throw 'Reachable';
}

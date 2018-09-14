/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test ambiguous regular expressions which include alternation or optional terms (?)
var S$ = require('S$');
var x = S$.symbol("X", '');
var regex = /^(a)+?$/
var b = x.match(regex);

if (b) {
	if (b[1].length == 15) throw 'Unreachable';
	if (b[0].length == 15) throw 'Reachable';
	throw 'Reachable';
}

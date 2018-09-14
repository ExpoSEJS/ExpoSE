/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//In this test a string constraint is used to force a relation between two captured strings
//The Regex in question though places the implicit constraint that C2 can only ever be one character wide though
var S$ = require('S$');
var x = S$.symbol("X", '');
var regex = /^(.+)(.+)$/ 
var b = x.match(regex);

if (b) {
	if (b[1] == b[2]) throw 'Reachable';
	throw 'Reachable';
}

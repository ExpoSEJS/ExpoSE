/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests replace on a global regex

var x = S$.symbol("X", '');
var b = /(a)/;

S$.assume(x.length < 5);

x = x.split(b);

if (x.length > 0 && x[0] == 'hi') {
	throw 'Reachable';
}

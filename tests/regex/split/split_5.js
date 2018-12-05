/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests replace on a global regex

var S$ = require('S$');
var x = S$.symbol("X", '');
var b = /.../;

S$.assume(x.length < 2);

x = x.split(b);

if (x.length > 1) {
	throw 'Unreachable';
}

if (x.length == 1) {
	throw 'Reachable';
}

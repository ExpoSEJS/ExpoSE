/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test whether the unicode property has worked

var x = S$.symbol("X", '');

if (/^\u{64}$/u.test(x)) {
	if (x != '\u0064') throw 'Unreachable';
	throw 'Reachable';
}

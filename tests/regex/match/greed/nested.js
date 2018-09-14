/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests nested depth greedy (Ambiguous) regular expressions with captures
var S$ = require('S$');
var x = S$.symbol("X", '');
var regex = /^((.)(.))?$/;
var b = x.match(regex);

if (b) {
	if (b[0] == '') {
		if (b[1] != null) throw 'Unreachable';
		if (b[2] != null) throw 'Unreachable';
		if (b[3] != null) throw 'Unreachable';
		throw 'Reachable';
	} else {
		if (b[3] == b[2]) throw 'Reachable';
		throw 'Reachable';
	}
}

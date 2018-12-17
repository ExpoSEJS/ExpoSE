/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests a replace on a non global regex

var S$ = require('S$');
var x = S$.symbol("X", '');
var b = /(a|b)/;

if (x.replace(b, 'Test') == 'Test') {

	if (x.indexOf('a') != -1) {
		throw 'Reachable';
	}

	if (x.indexOf('b') != -1) {
		throw 'Reachable';
	}

	throw 'Reachable';
}

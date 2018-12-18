/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests replace on a global regex

var S$ = require('S$');
var x = S$.symbol("X", '');

S$.assume(x.length < 5);

if (x != 'Test' && x.replace(/^a|b$/g, 'Test') == 'Test') {
	
	//In a global replace all instances should go
	if (x.indexOf('a') != -1 && x.indexOf('b') != -1) {
		throw 'Unreachable';
	}

	throw 'Reachable 1';
}

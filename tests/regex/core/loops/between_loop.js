/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Simple test of Term {Min, Max}
var S$ = require('S$');
var x = S$.symbol("X", '');

if (/^(abc){3,6}$/.test(x)) {
	if (x == 'abcabcabc') throw 'Reachable';
	if (x == 'abcabcabcabc') throw 'Reachable';
	if (x == 'abcabcabcabcabc') throw 'Reachable';
	if (x == 'abcabcabcabcabcabc') throw 'Reachable';
	throw 'Unreachable';
}

if (/^a{0,3}$/.test(x)) {
	if (x == '') throw 'Reachable';
	if (x == 'a') throw 'Reachable';
	if (x == 'aa') throw 'Reachable';
	if (x == 'aaa') throw 'Reachable';
	throw 'Unreachable';
}

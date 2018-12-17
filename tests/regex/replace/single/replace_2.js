/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests a replace on a non global regex

var S$ = require('S$');
var x = S$.symbol("X", 'a');
var b = /^(a|b)$/;

x = x.replace(b, 'hello');

console.log('X is ' + x);

if (x == 'hello') {
	throw 'Reachable';
}

if (x == 'a') {
	throw 'Unreachable';
}

if (x == 'b') {
	throw 'Unreachable';
}

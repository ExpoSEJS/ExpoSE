/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');

var x = S$.symbol('X', 5);
var y = S$.symbol('Y', false);

if (x == 0 && y == false) {} //Force x to false at least once

if (!(x == y)) {
	console.log('Here');
	throw 'Boo';
}

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var S$ = require('S$');
var a = S$.symbol("HELLO", 'HELLO');
var b = S$.symbol("NO", 'NOPE');

if (a === b) {
	console.log('Yes');
	S$.assert(a == b);
} else {
	console.log('Nope');
}

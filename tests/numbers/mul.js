/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var S$ = require('S$');
var x = S$.symbol('X', 10);

if (x * 100 > 150) {
	S$.assert(x * 100 > 150);
}

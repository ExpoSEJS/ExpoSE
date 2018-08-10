/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var s = require('S$');
var x = s.symbol('A', 5);

console.log("x is initialized to", x);

if (x > 0) {
	S$.assert(x > 0);
} else {
	S$.assert(x <= 0);
}

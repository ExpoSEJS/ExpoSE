/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var S$ = require('S$');
var x = S$.symbol("X", 10);
var s = S$.symbol("S", "foo");

console.log("x is initialized to", x);
console.log("s is initialized to", s);

if (x > 0) {
    console.log("x > 0");
} else {
    console.log("x <= 0");
}

console.log("prefix " + s + " suffix");

if ("x" + s + "z" == "xyz") {
	console.log("s is now " + s);
}

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var S$ = require("S$");

console.log("Fraction Test");
console.log("Loading Symbols");

var x = S$.symbol("X", 0);

console.log("Made X");

if (x > 0 && x < 1) {
  console.log("Bla");
}

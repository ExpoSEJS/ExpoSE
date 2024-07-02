/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require("S$");
var x = S$.symbol("X", [1]);

x[x.length] = 5;

console.log("X is: " + x + " with length " + x.length);

if (x[4] == 5) {
  throw "Reachable";
}

if (x[x.length - 1] != 5) {
  throw "Unreachable";
}

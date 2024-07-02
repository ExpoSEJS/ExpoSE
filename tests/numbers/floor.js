/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require("S$");
var x = S$.symbol("X", 5);

if (Math.floor(x) == 6) {
  throw "Reachable";
}

if (Math.ceil(x) == 9) {
  throw "Reachable";
}

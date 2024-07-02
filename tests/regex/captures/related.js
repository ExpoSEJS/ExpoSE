/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//In this test a string constraint is used to force a relation between two captured strings
var S$ = require("S$");
var x = S$.symbol("X", "");
var b = /^(.+)q(.+)$/.exec(x);

if (b) {
  if (b[1] == b[2]) throw "Reachable";
  throw "Reachable";
}

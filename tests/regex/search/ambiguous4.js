/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests a simple string search

var S$ = require("S$");
var x = S$.symbol("X", "");
var b = /[a-z]*/;
var nl = x.search(b);

S$.assume(x.length <= 5);

//The first set of as should be the match, but if greediness is not enforced either will be accepted
if (x == "hello") {
  if (nl == 2) {
    throw "Unreachable";
  }

  throw "Reachable 1";
}

if (x == "what") {
  if (nl != 0) {
    throw "Unreachable";
  }

  throw "Reachable 2";
}

if (x == "12345" && nl != 0) {
  throw "Unreachable";
}

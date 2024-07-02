/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require("S$");
var x = S$.symbol("X", "");
var regex = /(a)/;
var b = x.match(regex);

if (b) {
  if (x == "aaaabaa") throw "Reachable";
  if (x == "abcabcabcabcabca") throw "Reachable";
  if (b[0] != "a" || b[1] != "a") throw "Unreachable";
  throw "Reachable";
}

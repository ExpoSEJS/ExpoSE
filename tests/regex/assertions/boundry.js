/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test the assertion of lookahead must be a word
var S$ = require("S$");
var x = S$.symbol("X", "");

if (/^\b.$/.test(x)) {
  if (x == "a") throw "Unreachable";
  if (x == " ") throw "Reachable";
  throw "Reachable";
}

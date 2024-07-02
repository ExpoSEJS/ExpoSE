/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require("S$");
var x = S$.symbol("X", "");

if (/^[abcd]$/.test(x)) {
  if (x == "c") throw "Reachable";
  if (x == "") throw "Unreachable";
  if (x == "e") throw "Unreachable";
  throw "Reachable";
}

if (/^[a-z]*$/.test(x)) {
  if (x == "abcdef") throw "Reachable";
  if (x == "") throw "Reachable";
  if (x == "12345") throw "Unreachable";
  throw "Reachable";
}

if (/^[0-9]+$/.test(x)) {
  if (x == "12345") throw "Reachable";
  if (x == "12ab34") throw "Unreachable";
  if (x == "") throw "Unreachable";
  throw "Reachable";
}

throw "Reachable";

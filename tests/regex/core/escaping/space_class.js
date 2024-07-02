/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require("S$");
var x = S$.symbol("X", "");

//Any whitespace
if (/^\s$/.test(x)) {
  if (x == " ") throw "Reachable";
  if (x == "\f") throw "Reachable";
  if (x == "\n") throw "Reachable";
  if (x == "\r") throw "Reachable";
  if (x == "\t") throw "Reachable";
  if (x == "\v") throw "Reachable";
  throw "Unreachable";
}

//Anything but whitespace
if (/^\S$/.test(x)) {
  if (x == "\f") throw "Unreachable";
  if (x == "\n") throw "Unreachable";
  if (x == "\r") throw "Unreachable";
  if (x == "\t") throw "Unreachable";
  if (x == "\v") throw "Unreachable";
  throw "Reachable";
}

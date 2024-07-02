/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test the + operator

var S$ = require("S$");
var x = S$.symbol("X", "");

if (/^a+$/.test(x)) {
  throw "Reachable";
}

if (x == "a") {
  throw "Unreachable";
}

if (/^b+$/.test(x)) {
  throw "Reachable";
}

if (x == "b") {
  throw "Unreachable";
}

if (/^abc+$/.test(x)) {
  if (x == "abcabc") {
    throw "Unreachable";
  }

  throw "Reachable";
}

if (x == "abc") {
  throw "Unreachable";
}

throw "Reachable";

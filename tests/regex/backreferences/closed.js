/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test a single backreference of a closed capture group
var S$ = require("S$");
var x = S$.symbol("X", "");

if (/^(.)\1$/.test(x)) {
  if (x[0] != x[1]) {
    throw "Unreachable";
  }
  throw "Reachable";
}

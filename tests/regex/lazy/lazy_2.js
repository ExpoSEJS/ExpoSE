/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test the lastIndex property of the sticky flag

var S$ = require("S$");
var x = S$.symbol("X", "");
var b = /^[a-z]*?(aaa)$/.exec(x);

if (b != null) {
  if (!b[1] || b[1] !== "aaa") {
    throw "Unreachable";
  }

  throw "Reachable";
}

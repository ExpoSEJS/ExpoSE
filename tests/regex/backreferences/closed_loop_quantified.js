/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test a looped bref on a closed capture
var S$ = require("S$");
var x = S$.symbol("X", "");

S$.assume(x.length < 10);

if (/^(.)\1+$/.test(x)) {
  if (x.length > 3) {
    if (x.charAt(1) != x.charAt(0)) {
      throw "Unreachable";
    }

    if (x.charAt(2) != x.charAt(0)) {
      throw "Unreachable";
    }

    throw "Reachable";
  }

  throw "Reachable";
}

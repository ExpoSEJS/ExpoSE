/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test modeling of looped references to open capture groups (Local captures)
var S$ = require("S$");
var x = S$.symbol("X", "");

if (/^(([a-z])\2)+(([1-9])\4)+$/.test(x)) {
  if (x.length == 8) {
    if (x.charAt(0) != x.charAt(1)) {
      throw "Unreachable";
    }

    if (x.charAt(2) != x.charAt(3)) {
      throw "Unreachable";
    }

    if (x.charAt(4) != x.charAt(5)) {
      throw "Unreachable";
    }

    if (x.charAt(6) != x.charAt(7)) {
      throw "Unreachable";
    }
  }

  throw "Reachable";
}

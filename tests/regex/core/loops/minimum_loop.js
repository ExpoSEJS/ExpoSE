/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Simple test of Term {Min,}
var S$ = require("S$");
var x = S$.symbol("X", "");

//Restriction to avoid infinite feasible paths for dynamic analysis
S$.assume(x.length < 20);

if (/^(abc){3,}$/.test(x)) {
  if (x.length < 9) {
    throw "Unreachable";
  }

  if (x == "") {
    throw "Unreachable";
  }

  if (x == "abc") {
    throw "Unreachable";
  }

  if (x == "abcabc") {
    throw "Unreachable";
  }

  for (var i = 0; i < x.length; i += 3) {
    if (x.substr(i, 3) != "abc") {
      throw "Unreachable";
    }
  }

  throw "Reachable";
}

throw "Reachable";

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";
var S$ = require("S$");
var q = S$.symbol("q", "");

//This assumption is required to make the testcase solve in reasonable time with Z3
//This is not due to the regular expression but in fact due to the q.length and str.at
S$.assume(q.length < 10);

if (/--.+=$/.test(q)) {
  if (q[0] != "-") {
    throw "Reachable";
  }

  if (q[q.length - 1] != "=") {
    throw "Unreachable";
  }

  throw "Reachable";
}

throw "Reachable";

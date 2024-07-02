/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";
var S$ = require("S$");
var q = S$.symbol("q", "");

if (/^a|b|c$/.test(q)) {
  var isCorrect = q == "a" || q == "b" || q == "c";

  if (!isCorrect) {
    throw "Unreachable";
  }

  if (q == "a") {
    throw "Reachable";
  }

  if (q == "b") {
    throw "Unreachable";
  }

  if (q == "c") {
    throw "Reachable";
  }

  throw "Unreachable";
} else {
  throw "Reachable";
}

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Combine optional, non-greedy optional and non optional terms in the same regex and test

var S$ = require("S$");
var x = S$.symbol("X", "");

if (/^a?bcd(bcde)??$/.test(x)) {
  if (x == "bcd") throw "Reachable";
  if (x == "abcd") throw "Reachable";
  if (x == "bcdbcde") throw "Reachable";
  if (x == "abcdbcde") throw "Reachable";
  throw "Unreachable";
}

if (/^qerf??ef?$/.test(x)) {
  if (x == "qere") throw "Reachable";
  if (x == "qerfe") throw "Reachable";
  if (x == "qeref") throw "Reachable";
  if (x == "qerfef") throw "Reachable";
  throw "Unreachable";
}

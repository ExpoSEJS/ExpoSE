/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var S$ = require("S$");

// Expecting three paths
var q = S$.symbol("UnderTest", [false]);

if (q[0] === true) {
  throw "Reachable 1";
} else if (typeof q[0] === "boolean") {
  console.log("Another boolean value");
  throw "Reachable 2";
} else {
  throw "Reachable 3";
}

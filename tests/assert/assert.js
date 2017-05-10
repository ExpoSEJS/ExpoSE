/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";
var x = symbolic X initial 0;
assume x < 4;

for (var i = 0; i < x; i++) {
  console.log("Iteration " + i);
}

assert i != 5;
console.log("Assertion did not fail");

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require("S$");

if (S$.symbol("X", false)) {
  console.log("Hello");
} else {
  console.log("Goodbye");
}

if (true) {
  console.log("Hello");
} else {
  console.log("Goodbye");
}

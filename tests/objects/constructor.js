/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require("S$");
var x = S$.symbol("X", "");
x = Object(x);

console.log("What what what");
console.log("X eq hello? " + (x == "Hello"));
console.log("Doop");

if (x == "Hello") {
  throw "Reachable";
}

if (x == Object("Hello")) {
  throw "Unreachable";
}

if (x == Object("How")) {
  throw "Reachable 2";
}

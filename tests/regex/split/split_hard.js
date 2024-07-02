/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests replace on a global regex

var S$ = require("S$");
var x = S$.symbol("X", "");
var b = /(a)/;

x = x.split(b);

S$.assume(x.length < 100);

if (x.length == 16) {
  if (x[x.length - 1] == "hello") {
    throw "Unreachable"; //Broken by the assumption on string length
  }
}

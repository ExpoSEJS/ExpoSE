/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests a replace on a non global regex

var S$ = require("S$");
var x = S$.symbol("X", "a");
var b = /^...$/;

x = x.replace(b, "abdef");

if (x == "hello") {
  throw "Reachable 1";
}

if (x == "abc") {
  throw "Unreachable";
}

if (x == "def") {
  throw "Unreachable";
}

if (x == "abdef") {
  throw "Reachable 2";
}

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require("S$");
var x = S$.symbol("X", "");

if (/^he*llo_world*$/.test(x)) {
  throw "Reachable";
}

if (/^(hello)*(world)*$/.test(x)) {
  throw "Reachable";
}

if (/^he*llo_world*$/.test(x)) {
  throw "Unreachable";
}

if (/^(hello)*(world)*$/.test(x)) {
  throw "Unreachable";
}

if (/^a*$/.test(x)) {
  throw "Reachable";
}

if (/^b*$/.test(x)) {
  throw "Reachable";
}

throw "Reachable";

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require("S$");
var x = S$.symbol("X", "");

//Z3 doesn't support Unicode in RE officially so there is no guarentee unicode sequences will work
if (/^\uEEFF$/.test(x)) {
  if (x != "\uEEFF") throw "Unreachable";
  throw "Reachable";
}

if (/^\uAAAA$/.test(x)) {
  if (x != "\uAAAA") throw "Unreachable";
  throw "Reachable";
}

if (/^\u42BF$/.test(x)) {
  if (x != "\u42BF") throw "Unreachable";
  throw "Reachable";
}

if (/^\u2313$/.test(x)) {
  if (x != "\u2313") throw "Unreachable";
  throw "Reachable";
}

if (/^\u6534$/.test(x)) {
  if (x != "\u6534") throw "Unreachable";
  throw "Reachable";
}

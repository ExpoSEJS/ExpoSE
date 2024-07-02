/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require("S$");
var x = S$.symbol("X", "");

var re = /^(?=([0-9])).$/;
var re2 = /^[0-9]$/;

var r = re.exec(x);

if (r) {
  if (!re2.test(r[0])) {
    throw "Unreachable";
  }

  throw "Reachable";
}

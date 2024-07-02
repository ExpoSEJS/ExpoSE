/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require("S$");
var x = S$.symbol("X", "");

var re2 = /^a(?=(a))a$/;

//Capture some text in an assertion
if (re2.test(x)) {
  var caps = re2.exec(x);

  if (caps[1] == "a") {
    throw "Reachable";
  } else {
    throw "Unreachable";
  }
}

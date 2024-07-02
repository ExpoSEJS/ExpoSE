/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test that multiline changes ^ into (\n or ^) and $ into (\n or $)
var S$ = require("S$");
var x = S$.symbol("X", "");
var re = /Hello/y;

S$.assume(x.length < 13);

if (re.test(x)) {
  if (re.test(x)) {
    //Length < 4, sticky is set, lastIndex should be 3, cant match again
    throw "Reachable 2";
  }

  throw "Reachable 1";
}

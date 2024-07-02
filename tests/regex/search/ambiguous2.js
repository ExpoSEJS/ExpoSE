/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Tests a simple string search

var x = S$.symbol("X", "");
var b = /(a*)(ab)?/;
var nl = x.search(b);

S$.assume(x.length < 5);

if (x.charAt(3) == "b") {
  //Locked by anchor to be 0
  throw "Reachable";
}

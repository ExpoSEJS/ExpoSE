/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test ambiguities brought about by greediness and anchors
var S$ = require("S$");
var x = S$.symbol("X", "");
var regex = /.../;
var b = x.match(regex);

if (b) {
  if (x.length == 3) throw "Reachable";
  if (x.length > 9) throw "Reachable";
  if (b[0].length != 3) throw "Unreachable";
  throw "Reachable";
}

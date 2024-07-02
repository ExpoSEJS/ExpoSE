/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var x = S$.symbol("X", "");

if (/^git(?:@|:\/\/)github\.com(?::|\/)([^\/]+\/[^\/]+)\.git$/.test(x)) {
  if (x.length > 0) throw "Reachable";
  if (x.length == 0) throw "Unreachable";
  if (x.indexOf("git") == -1) throw "Unreachable";
  if (x.indexOf("@") == -1) throw "Reachable";
}

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var x = S$.symbol("X", "");

//The lack of anchors ^ and $ means that this program can throw errors
if (/a|b|c/.test(x)) {
  if (/a/.test(x)) {
    S$.assert(!/c/.test(x));
    S$.assert(!/b/.test(x));
  }

  if (/b/.test(x)) {
    S$.assert(!/a/.test(x));
    S$.assert(!/c/.test(x));
  }

  if (/c/.test(x)) {
    S$.assert(!/a/.test(x));
    S$.assert(!/b/.test(x));
  }
}

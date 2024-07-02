/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

function fibs(n) {
  if (n < 2) {
    return n;
  }

  return fibs(n - 1) + fibs(n - 2);
}

fibs(15);

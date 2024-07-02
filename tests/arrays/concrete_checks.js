/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var x = [1, 2, 3];

if (x[2] != 3) {
  throw "Unreachable";
}

if (x[0] != 1) {
  throw "Unreachable";
}

console.log("X: " + x);

if (
  x.filter(function (x) {
    console.log(x);
    return x == 1;
  }).length != 1
) {
  throw "Unreachable";
}

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

/* We want one to check that you can generate integer number, one to check you can generate non-integer (like 5.4) and one to generate you can generate a constant to arbitrary precision. Also test it fails for length <0 and > 20
*/

"use strict";

var S$ = require('S$');
var x = S$.symbol('Int', 52);
var length = S$.symbol('Int', 3);

console.log("x is initialized to", x);
console.log("length is initialized to", length);

console.log(typeof(x));

if (x.toFixed(length) == 5) {
    console.log('Hi');
}

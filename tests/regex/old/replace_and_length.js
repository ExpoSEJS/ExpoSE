/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var x = S$.symbol("X", "");

if (x == "HELLO WORLD") {
}

if (x.length > 4 && x.replace(/hello/g, "") === "") {
  console.log("Aah");
}

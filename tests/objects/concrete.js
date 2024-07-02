/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require("S$");

var x = {};

x[4] = "Hi";

x["Hello"] = 32;

x[false] = true;

S$.assert(x[false] == true);
S$.assert((x["Hello"] = 32));
S$.assert(x[4] == "Hi");

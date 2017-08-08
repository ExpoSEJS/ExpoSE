/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var a;
var b;

a = true;
b = a;

assert a == b;

a = !a;

assert a != b;

b = !a;

assert b != a;

b = a;

assert b == a;

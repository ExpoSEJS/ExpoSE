/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

traitdef Test;
traitdef NoTest;

var x = 5 as <!Test!> drop <!Test!>;

function f(x: <!Test * Test * Test!>) {

}

f(x);

assert x is <!Test!>;

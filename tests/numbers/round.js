/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');

var value = S$.symbol('VALUE', 1);
var decimal = S$.symbol('DECIMAL', 3);
var rounded = Math.round(decimal);

if (value != rounded) {
    throw 'R1';
} else {
    throw 'R2';
}

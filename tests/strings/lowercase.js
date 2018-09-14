/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//to lowercase smoke test
//Does not exhaustively test, just our weak model

var S$ = require('S$');
var x = S$.symbol("X", '');

if (x.toLowerCase() == 'what_is_my_name') {
	throw 'Reachable';
}

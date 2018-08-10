/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');
var x = S$.symbol("A", "Hello");
var y = S$.symbol("B", "Goodbye");

if (x.concat('abc',y) == "aabcd") {
	//One path
	console.log('Weird');
}

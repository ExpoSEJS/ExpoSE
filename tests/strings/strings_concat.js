/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var x = symbolic A initial "Hello";
var y = symbolic B initial "Goodbye";

if (x.concat('abc',y) == "aabcd") {
	//One path
	console.log('Weird');
}

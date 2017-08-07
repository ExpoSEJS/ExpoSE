/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var a = symbolic A initial 'hello';

if (a === "goodbye") {
	console.log('PASS');
} else {
	console.log('FAIL');
}

if (a === "derp") {
	console.log('AND THEN SOME');
} else {
	console.log('NOT THEN SOME');
}

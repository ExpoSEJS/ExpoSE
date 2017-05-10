/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var a = symbolic HELLO initial 'HELLO';
var b = symbolic NO initial 'NOPE';

if (a === b) {
	console.log('Yes');
	assert a == b;
} else {
	console.log('Nope');
}

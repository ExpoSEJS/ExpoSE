/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var a = symbolic HI initial 'hi';

if (a.length > 0 && a !== 'hello' && a.replace('h...o', '') === '') {
	assert a.length != 0;
	console.log('A length: ' + a.length);
}

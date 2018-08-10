/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";


var S$ = require('S$');
var x = S$.pureSymbol('X');

if (x instanceof Array) {
	assume x.length < 4;
	for (var i = 0; i < x.length; i++) {
		
		if (x[i] == 53) {
			throw 'Reachable 3';
		}

		if (x[i] == 'What' && x[i] == 'No') {
			throw 'Unreachable';
		}

		if (x[i] == 'What') {
			throw 'Reachable';
		}

		if (x[i] == false) {
			throw 'Reachable 2';
		}
	}
}
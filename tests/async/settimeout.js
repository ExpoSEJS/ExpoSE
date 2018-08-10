/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var S$ = require('S$');

setTimeout(function() {
	var x = S$.assume('A', 5);
	
	if (x > 10) {
		console.log('X > 10');
		setTimeout(function() {
			if (x < 20) {
				console.log('Err');
				throw 'AAAH';
			}
		}, 200);
	} else {
		console.log('X <= 10');
	}

}, 150);

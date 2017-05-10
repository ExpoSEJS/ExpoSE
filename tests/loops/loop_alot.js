/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var q = symbolic Q initial 10;

if (q < 10) {
	var j = 0;

	for (var i = 0; i < q; i++) {
		j++;
	}

	console.log('Done ' + j);
}

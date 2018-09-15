/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

function do_polymorph(x, y) {
	
	if (!x) {
		throw '1';
	}

	if (x == y) {
		throw '2';
	}

	if (x == 5) {
		throw '3';
	}

	if (y == 'What') {
		throw '4';
	}
}

do_polymorph(symbolic X, symbolic Y);

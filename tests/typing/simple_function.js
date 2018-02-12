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
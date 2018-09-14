/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test that multiline changes ^ into (\n or ^) and $ into (\n or $)
var x = S$.symbol("X", '');

if (/^ABC$/i.test(x)) {
	if (x == 'abc') throw 'Reachable';
	if (x == 'ABC') throw 'Reachable';

	if (x[0] == 'a' || x[0] == 'A') throw 'Reachable';
	if (x[1] == 'b' || x[1] == 'B') throw 'Reachable';
	if (x[2] == 'c' || x[2] == 'C') throw 'Reachable';

	throw 'Unreachable';
}

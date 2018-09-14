/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

//Test that multiline changes ^ into (\n or ^) and $ into (\n or $)
var x = S$.symbol("X", '');

if (/^abc$/m.test(x)) {
	if (x == 'helloabc') throw 'Unreachable';
	if (x == 'hello\nabc') throw 'Reachable';
	if (x == 'hello\nabc\nworld') throw 'Reachable';
	throw 'Reachable';
}

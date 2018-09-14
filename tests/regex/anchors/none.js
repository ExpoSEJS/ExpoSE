/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

'use strict';
var S$ = require('S$');
var q = S$.symbol("q", '');

if (/--.+=/.test(q)) {

	if (q.charAt(0) != '-') {
		throw 'Reachable';
	}

	if (q.charAt(q.length - 1) != '=') {
		throw 'Reachable';
	}

	throw 'Reachable';
}

throw 'Reachable';

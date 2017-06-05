'use strict';

var q = symbolic q initial '';

if (/^--.+=$/.test(q)) {

	if (q[0] != '-') {
		throw 'Unreachable';
	}

	if (q[q.length - 1] != '=') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
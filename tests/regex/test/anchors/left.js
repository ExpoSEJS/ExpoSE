'use strict';

var q = symbolic q initial '';

//Implict anchor => /--.+=.*?/ (will let anything in after the =)
if (/^--.+=/.test(q)) {

	if (q[0] != '-') {
		throw 'Unreachable';
	}

	if (q[q.length - 1] != '=') {
		throw 'Reachable';
	}

	throw 'Reachable';
}
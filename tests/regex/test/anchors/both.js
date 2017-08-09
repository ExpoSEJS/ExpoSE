'use strict';

var q = symbolic q initial '';

//This assumption is required to make the testcase solve in reasonable time with Z3
//This is not due to the regular expression but in fact due to the q.length and str.at
assume q.length < 10;

if (/^--.+=$/.test(q)) {

	if (q[0] != '-') {
		throw 'Unreachable';
	}

	if (q[q.length - 1] != '=') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
'use strict';

var q = S$.symbol("q", '');

//This assumption is required to make the testcase solve in reasonable time with Z3
//This is not due to the regular expression but in fact due to the q.length and str.at
S$.assume(q.length < 10);

if (/^--.+=$/.test(q)) {

	if (q[0] != '-') {
		throw 'Unreachable';
	}

	if (q[q.length - 1] != '=') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
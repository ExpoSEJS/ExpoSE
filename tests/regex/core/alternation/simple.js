'use strict';

var q = S$.symbol("q", '');

if (/^a|b|c$/.test(q)) {

	var isCorrect = q == 'a' || q == 'b' || q == 'c';

	if (!isCorrect) {
		throw 'Unreachable';
	}

	if (q == 'a') {
		throw 'Reachable';
	}

	if (q == 'b') {
		throw 'Unreachable';
	}

	if (q == 'c') {
		throw 'Reachable';
	}

	throw 'Unreachable';
} else {
	throw 'Reachable';
}
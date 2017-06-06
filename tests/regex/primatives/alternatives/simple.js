'use strict';

var q = symbolic q initial '';

if (/^a|b|c$/.test(q)) {
	
	throw 'Reachable';

	var isCorrect = q == 'a' || q == 'b' || q == 'c';

	if (!isCorrect) {
		throw 'Unreachable';
	}

} else {
	throw 'Reachable';
}
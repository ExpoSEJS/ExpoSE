var S$ = require('S$');
var x = S$.symbol("X", '');

var re3 = /^(?=(a|b|c)).$/;

if (re3.test(x)) {
	
	if (x == 'd') {
		throw 'Unreachable';
	}

	if (x == 'a') {
		throw 'Reachable';
	}

	if (x == 'b') {
		throw 'Reachable';
	}

	if (x == 'c') {
		throw 'Reachable';
	}

	throw 'Unreachable';
}
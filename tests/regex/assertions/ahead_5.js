var S$ = require('S$');
var x = S$.symbol("X", '');

var re = /^.(?=(a|b|c)).$/;

if (re.test(x)) {
	
	if (x.charAt(1) == 'd') {
		throw 'Unreachable';
	}

	if (x.charAt(1) == 'a') {
		throw 'Reachable';
	}

	if (x.charAt(1) == 'b') {
		throw 'Reachable';
	}

	if (x.charAt(1) == 'c') {
		throw 'Reachable';
	}

	throw 'Unreachable';
}
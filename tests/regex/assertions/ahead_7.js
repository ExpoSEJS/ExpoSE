var S$ = require('S$');
var x = S$.symbol("X", '');

var re = /^(?=([0-9])).$/;
var re2 = /^[0-9]$/;

if (re.test(x)) {
	
	if (!re2.test(x)) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
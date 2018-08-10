//Test the lastIndex property of the sticky flag

var S$ = require('S$');
var x = S$.symbol("X", '');
var b = /^a*?(a)?$/.exec(x);

if (b != null) {
	
	if (b[1] == 'a') {
		throw 'Reachable';
	} else if (!b[1]) {
		throw 'Reachable';
	}

	throw 'Unreachable';
}
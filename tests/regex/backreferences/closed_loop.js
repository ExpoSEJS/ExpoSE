//Test a looped bref on a closed capture
var S$ = require('S$');
var x = S$.symbol("X", '');

if (/^(.)\1+$/.test(x)) {
	
	if (x.charAt(1) != x.charAt(0)) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
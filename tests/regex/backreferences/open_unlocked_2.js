//Test modeling of looped references to open capture groups with a forced varying capture
var S$ = require('S$');
var x = S$.symbol("X", '');

if (/^((.)\2)+$/.test(x)) {

	//This will only be reachable of the model accurately represents varying local groups
	if (x.length == 8) {
		
		if (x.charAt(0) == x.charAt(5) && x.charAt(0) != x.charAt(2)) {
			throw 'Reachable';
		}

		if (x.charAt(0) == x.charAt(2) && x.charAt(3) != x.charAt(4)) {
			throw 'Unreachable';
		}

		throw 'Reachable';
	}

	throw 'Reachable';
}
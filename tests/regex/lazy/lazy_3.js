//Test the lastIndex property of the sticky flag

var x = S$.symbol("X", '');
var b = /^(a)*?a$/.exec(x);

if (b != null) {
	
	if (x == 'a') {

		if (b[1] == 'a') {
			throw 'Unreachable';
		}

		throw 'Reachable';
	}

	throw 'Reachable';
}
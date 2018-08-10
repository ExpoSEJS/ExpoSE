//Test the lastIndex property of the sticky flag

var x = S$.symbol("X", '');
var b = /^(a{1,3}?)(a)?$/.exec(x);

if (b != null) {
	
	if (x == 'a') {
		if (!b[1]) {
			throw 'Unreachable';
		}

		if (!!b[2]) {
			throw 'Unreachable';
		}

		throw 'Reachable';
	}

	throw 'Reachable';
}
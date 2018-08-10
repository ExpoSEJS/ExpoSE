//Test the lastIndex property of the sticky flag

var x = S$.symbol("X", '');
var b = /^(a)+?a$/.exec(x);

if (b != null) {
	
	if (x == 'a') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
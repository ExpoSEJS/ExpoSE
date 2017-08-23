//Test the lastIndex property of the sticky flag

var x = symbolic X initial '';
var b = /^(a)+?a$/.exec(x);

if (b != null) {
	
	if (x == 'a') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
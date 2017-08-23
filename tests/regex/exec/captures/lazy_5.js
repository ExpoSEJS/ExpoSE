//Test the lastIndex property of the sticky flag

var x = symbolic X initial '';
var b = /^(a)+?a?$/.exec(x);

if (b != null) {
	
	if (x == 'a') {
		if (b[1] != 'a') {
			throw 'Unreachable';
		}
	}

	if (b[1] == '') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
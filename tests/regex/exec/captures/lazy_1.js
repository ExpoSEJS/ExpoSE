//Test the lastIndex property of the sticky flag

var x = symbolic X initial '';
var b = /^a*?(a)?$/y.exec(x);

if (b != null) {
	
	if (b[1] == 'a') {
		throw 'Reachable';
	} else if (!b[1]) {
		throw 'Reachable';
	}

	throw 'Unreachable';
}
//Test the lastIndex property of the sticky flag

var x = symbolic X initial '';
var b = /^[a-z]*?(aaa)$/y.exec(x);

if (b != null) {
	
	if (!b[1] || b[1] !== 'aaa') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
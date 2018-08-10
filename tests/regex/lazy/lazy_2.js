//Test the lastIndex property of the sticky flag

var x = S$.symbol("X", '');
var b = /^[a-z]*?(aaa)$/.exec(x);

if (b != null) {
	
	if (!b[1] || b[1] !== 'aaa') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
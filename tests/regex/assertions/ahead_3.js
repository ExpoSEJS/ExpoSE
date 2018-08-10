var x = S$.symbol("X", '');

var re3 = /^b(?=b).$/;

if (re3.test(x)) {
	
	if (x != 'bb') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
//Test the + operator

var x = S$.symbol("X", '');

if (/^a+$/.test(x)) {
	throw 'Reachable';
}

if (x == 'a') {
	throw 'Unreachable';
}

if (/^b+$/.test(x)) {
	throw 'Reachable';
}

if (x == 'b') {
	throw 'Unreachable';
}

if (/^abc+$/.test(x)) {

	if (x == 'abcabc') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

if (x == 'abc') {
	throw 'Unreachable';
}

throw 'Reachable';
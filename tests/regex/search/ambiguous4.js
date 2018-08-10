//Tests a simple string search

var x = S$.symbol("X", '');
var b = /[a-z]*/;
var nl = x.search(b);

S$.assume(x.length <= 5);

//The first set of as should be the match, but if greediness is not enforced either will be accepted
if (x == 'hello') {

	if (nl == 2) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

if (x == 'what') {
		
	if (nl != 0) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

if (x == '12345' && nl != 0) {
	throw 'Unreachable';
}
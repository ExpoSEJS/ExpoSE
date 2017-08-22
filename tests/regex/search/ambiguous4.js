//Tests a simple string search

var x = symbolic X initial '';
var b = /[a-z]*/;
var nl = x.search(b);

assume nl != -1;

//The first set of as should be the match, but if greediness is not enforced either will be accepted
if (x == 'hello_world') {

	if (nl == 7) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

if (x == 'goodbye') {
		
	if (nl != 0) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

if (x == '1231241' && nl != 0) {
	throw 'Unreachable';
}
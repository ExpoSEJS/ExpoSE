//Tests a simple string search

var x = symbolic X initial '';

assume x.length < 7;

var b = /(a*)/;
var nl = x.search(b);

if (nl != -1) {

	//The first set of as should be the match, but if greediness is not enforced either will be accepted
	if (x == 'aaaa_a') {

		if (nl == 5) {
			throw 'Unreachable';
		}

		throw 'Reachable';
	}

	throw 'Reachable';
}
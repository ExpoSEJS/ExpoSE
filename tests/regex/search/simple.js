//Tests a simple string search

var x = symbolic X initial '';
var b = /^abc$/;
var nl = x.search(b);

if (nl != -1) {
	
	if (nl != 0) {
		//Locked by anchor to be 0
		throw 'Unreachable';
	}

	throw 'Reachable';
} else {
	//b not in x
	throw 'Reachable';
}
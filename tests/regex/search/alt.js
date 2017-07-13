//Tests a simple string search

var x = symbolic X initial '';
var b = /^(a|b)$/;
var nl = x.search(b);

if (nl != -1) {

	console.log('B is ' + b);
	
	if (nl = 3) {
		throw 'Unreachable';
	}
	
	if (x == 'a') throw 'Reachable';
	if (x == 'b') throw 'Reachable';

	throw 'Unreachable';
} else {
	//b not in x
	throw 'Reachable';
}
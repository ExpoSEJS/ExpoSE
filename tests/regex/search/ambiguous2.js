//Tests a simple string search

var x = symbolic X initial '';
var b = /(a*)(ab)?/;
var nl = x.search(b);

assume x.length < 5;

if (x.charAt(3) == 'b') {
	//Locked by anchor to be 0
	throw 'Reachable';
}
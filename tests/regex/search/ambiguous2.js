//Tests a simple string search

var x = S$.symbol("X", '');
var b = /(a*)(ab)?/;
var nl = x.search(b);

S$.assume(x.length < 5);

if (x.charAt(3) == 'b') {
	//Locked by anchor to be 0
	throw 'Reachable';
}
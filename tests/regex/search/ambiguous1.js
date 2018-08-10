//Tests a simple string search
var S$ = require('S$');

var x = S$.symbol("X", '');
var b = /abc/;
var nl = x.search(b);

if (nl != -1) {
	
	if (nl != 0) {
		//Locked by anchor to be 0
		throw 'Reachable';
	}

	throw 'Reachable';
}
var S$ = require('S$');
var x = S$.symbol("X", '');
var b = /^([a-z])$/.exec(x);

if (b) {
	if (b[1] == 'a') throw 'Reachable';
	throw 'Reachable';
}
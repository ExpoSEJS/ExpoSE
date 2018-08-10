var S$ = require('S$');
var x = S$.symbol("X", '');
var regex = /^([a-z])$/;
var b = x.match(regex);

if (b) {
	if (b[1] == 'a') throw 'Reachable';
	throw 'Reachable';
}
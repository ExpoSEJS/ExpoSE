var S$ = require('S$');

var x = S$.symbol('X', false);

if (x) {
	throw 'Reachable';
}

var S$ = require('S$');

var x = S$.symbol('X', 5);
var y = S$.symbol('Y', false);

if (x == 0 && y == false) {} //Force x to false at least once

if (!(x == y)) {
	console.log('Here');
	throw 'Boo';
}
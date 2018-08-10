var S$ = require('S$');
var x = S$.symbol("X", '');

var re = /^(?=(..))[a-z]+$/;

var r = re.exec(x);

if (r) {
	throw 'Reachable';
}
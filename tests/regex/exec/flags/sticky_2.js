var S$ = require('S$');
var re = /hello/y;
var x = S$.symbol("X", '');

S$.assume(x.length < 15);

var i = 0;

while (x.match(re)) {
	i++;
}

if (x > 3) {
	throw 'Unreachable';
}

throw 'Reachable';
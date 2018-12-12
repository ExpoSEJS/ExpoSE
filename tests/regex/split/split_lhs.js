var S$ = require('S$');
var x = S$.symbol('A', '');

S$.assume(x.length == 3);

var y = x.split(/a/);

S$.assume(y.length == 2);

if (x.split(/a/)[0] == "h") {
	throw 'Reachable 1';
}

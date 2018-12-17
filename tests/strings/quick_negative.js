var S$ = require('S$');
var b = S$.symbol('A', '');

if (b.slice(-1) == "h") {
	throw 'Reachable';
}

var S$ = require('S$');
var x = S$.symbol('X', 5);

var y = eval('6');

if (x > y) {
	S$.assert(x < y);
}
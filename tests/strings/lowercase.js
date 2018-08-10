//to lowercase smoke test
//Does not exhaustively test, just our weak model

var S$ = require('S$');
var x = S$.symbol("X", '');

if (x.toLowerCase() == 'what_is_my_name') {
	throw 'Reachable';
}
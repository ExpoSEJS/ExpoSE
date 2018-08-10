//Test variable renaming scheme
var S$ = require('S$');
var x = S$.symbol("X", 0);
var y = S$.symbol("X", 10);

console.log('Wat');

if (x == 5) {
} else {
	if (x == y) {
		throw 'Reachable 1';
	}

	throw 'Reachable 2';
}
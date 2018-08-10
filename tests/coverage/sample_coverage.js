var S$ = require('S$');

if (S$.symbol('X', false)) {
	console.log('Hello');
} else {
	console.log('Goodbye');
}

if (true) {
	console.log('Hello');
} else {
	console.log('Goodbye');
}
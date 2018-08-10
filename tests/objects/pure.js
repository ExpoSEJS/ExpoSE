var S$ = require('S$');
var test = S$.pureSymbol('X');

if (test.hello == 'what') {
	throw 'Reachable';
}

test.hello = 'what';

if (test.hello != 'what') {
	throw 'Unreachable';
}
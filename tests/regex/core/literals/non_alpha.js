var S$ = require('S$');
var x = S$.symbol("X", '');
var isIn = /^void helloWorld\(\) \{\{\}\} DOGDOGDOG console.log\(HELLO WORLD\) HOW ARE YOU$/.test(x);

if (isIn) {
	throw 'Reachable';
} else {
	throw 'Reachable';
}
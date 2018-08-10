//In this test a string constraint is used to force a relation between two captured strings
var S$ = require('S$');
var x = S$.symbol("X", '');
var regex = /^(.+)q(.+)$/ 
var b = x.match(regex);

if (b) {
	if (b[1] == b[2]) throw 'Reachable';
	throw 'Reachable';
}
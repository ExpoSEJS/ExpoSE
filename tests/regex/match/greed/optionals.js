//Test ambiguous regular expressions which include alternation or optional terms (?)
var S$ = require('S$');
var x = S$.symbol("X", '');
var regex = /^(a)+?$/
var b = x.match(regex);

if (b) {
	if (b[1].length == 15) throw 'Unreachable';
	if (b[0].length == 15) throw 'Reachable';
	throw 'Reachable';
}
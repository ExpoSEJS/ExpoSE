//Test the assertion of lookahead must be a word
var x = S$.symbol("X", '');

if (/^\b.$/.test(x)) {
	if (x == 'a') throw 'Unreachable';
	if (x == ' ') throw 'Reachable';
	throw 'Reachable';
}
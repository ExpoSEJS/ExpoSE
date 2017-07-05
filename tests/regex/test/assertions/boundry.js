//Test the assertion of lookahead must be a word
var x = symbolic X initial '';

if (/^\w.$/.test(x)) {
	if (x == 'a') throw 'Unreachable';
	if (x == ' ') throw 'Reachable';
	throw 'Reachable';
}

throw 'Reachable';
var x = S$.symbol("X", '');
var b = /(a)/.exec(x);

if (b) {
	if (x == 'aaaabaa') throw 'Reachable';
	if (x == 'abcabcabcabcabca') throw 'Reachable';
	if (b[0] != 'a' || b[1] != 'a') throw 'Unreachable';
	throw 'Reachable';
}
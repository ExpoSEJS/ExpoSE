var x = symbolic X initial '';
var b = /(a)/.exec(x);

if (b) {
	if (b[0] == 'a') throw 'Reachable';
	if (b[0] == 'aaaabaa') throw 'Reachable';
	if (b[0] == 'abcabcabcabcabca') throw 'Reachable';
	if (b[1] != 'a') throw 'Unreachable';
	throw 'Reachable';
}
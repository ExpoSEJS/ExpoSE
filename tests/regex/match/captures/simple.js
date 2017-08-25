var x = symbolic X initial '';
var regex = /(a)/
var b = x.match(regex);

if (b) {
	if (x == 'aaaabaa') throw 'Reachable';
	if (x == 'abcabcabcabcabca') throw 'Reachable';
	if (b[0] != 'a' || b[1] != 'a') throw 'Unreachable';
	throw 'Reachable';
}
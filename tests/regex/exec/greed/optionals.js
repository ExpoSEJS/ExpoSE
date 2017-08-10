//Test ambiguous regular expressions which include alternation or optional terms (?)

var x = symbolic X initial '';
var b = /^(a)+?$/.exec(x);

if (b) {
	if (b[1].length == 15) throw 'Unreachable';
	if (b[0].length == 15) throw 'Reachable';
	throw 'Reachable';
}
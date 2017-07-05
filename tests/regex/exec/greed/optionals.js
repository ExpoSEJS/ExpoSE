//Test ambiguous regular expressions which include alternation or optional terms (?)

var x = symbolic X initial '';
var b = /^(a)+?(a)+(a)?$/.exec(x);

if (b) {
	if (b[1].length > b[2].length) throw 'Unreachable';
	if (b[3] != '') throw 'Unreachable';
	if (b[1] == '') throw 'Unreachable';
	if (b[2] == '') throw 'Unreachable';
	throw 'Reachable';
}
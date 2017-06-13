var x = symbolic X initial '';
var b = /(a)(b)(c)/.exec(x);

if (b) {
	if (b[1] != 'a') throw 'Unreachable';
	if (b[2] != 'b') throw 'Unreachable';
	if (b[3] != 'c') throw 'Unreachable';
	if (b[0].charAt(0) != 'a') throw 'Reachable';
	if (b[1].charAt(b.length - 1) != 'c') throw 'Reachable';
	throw 'Reachable';
}
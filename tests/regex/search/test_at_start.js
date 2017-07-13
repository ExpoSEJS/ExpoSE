var x = symbolic X initial '';
var b = /(a|b)$/;
var nl = x.search(b);

if (nl != -1) {
	if (b[nl] != 'a' && b[nl] != 'b') throw 'Unreachable';
	if (nl < 0) throw 'Unreachable';
	if (nl == 0) throw 'Reachable';
	if (nl == 5) throw 'Reachable';
	if (nl == 250) throw 'Reachable';
	throw 'Reachable';
} else {
	//b not in x
	throw 'Reachable';
}
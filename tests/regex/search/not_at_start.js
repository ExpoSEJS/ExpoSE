var x = S$.symbol("X", '');
var b = /(a|b)$/;
var nl = x.search(b);

if (nl != -1) {
	if (nl < 0) throw 'Unreachable';
	if (nl > 3) throw 'Reachable';
	throw 'Reachable';
} else {
	//b not in x
	throw 'Reachable';
}
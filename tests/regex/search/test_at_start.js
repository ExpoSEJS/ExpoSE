var x = S$.symbol("X", '');
var b = /(a|b)$/;
var nl = x.search(b);

if (nl != -1) {

	if (nl < 0) throw 'Unreachable';
	if (nl == 0) throw 'Reachable';
	if (nl == 5) throw 'Reachable';
	if (nl == 15) throw 'Reachable';

	var in_re = b[nl] == 'a' || b[nl] == 'b';

	if (!in_re) {
		throw 'Unreachable';
	} else {
		throw 'Reachable';
	}
}
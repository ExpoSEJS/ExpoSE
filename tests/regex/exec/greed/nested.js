//Tests nested depth greedy (Ambiguous) regular expressions with captures

var x = symbolic X initial '';
var b = /((..)+(.))?/.exec(x);

if (b) {
	
	if (b[0] == '') {
		if (b[1] != '') throw 'Unreachable';
		if (b[2] != '') throw 'Unreachable';
		if (b[3] != '') throw 'Unreachable';
		throw 'Reachable';
	}

	if (b[2].length == 0) throw 'Unreachable';
	if (b[3].length != 1) throw 'Unreachable';

	if (b[3] == b[2]) throw 'Reachable';

	throw 'Reachable';
}
//Tests nested depth greedy (Ambiguous) regular expressions with captures

var x = symbolic X initial '';
var regex = /^((.)(.))?$/;
var b = x.match(regex);

if (b) {
	if (b[0] == '') {
		if (b[1] != null) throw 'Unreachable';
		if (b[2] != null) throw 'Unreachable';
		if (b[3] != null) throw 'Unreachable';
		throw 'Reachable';
	} else {
		if (b[3] == b[2]) throw 'Reachable';
		throw 'Reachable';
	}
}
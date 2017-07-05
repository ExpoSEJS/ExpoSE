//Test modeling of looped references to open capture groups (Local captures)

var x = symbolic X initial '';

assume x.length < 10;

if (/^((.)\2)+$/.test(x)) {

	for (var i = 0; i < x.length; i += 2) {
		if (x[i+1] != x[i]) throw 'Unreachable';
	}

	throw 'Reachable';
}
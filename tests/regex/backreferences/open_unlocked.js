//Test modeling of looped references to open capture groups with a forced varying capture

var x = symbolic X initial '';

assume x.length < 10;

if (/^((.)\2)+$/.test(x)) {

	for (var i = 0; i < x.length; i += 2) {
		if (x[i+1] != x[i]) throw 'Unreachable';
	}

	//This will only be reachable of the model accurately represents varying local groups
	if (x[0] != x[2]) {
		throw 'Reachable';
	}

	throw 'Reachable';
}
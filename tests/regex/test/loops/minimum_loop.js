//Simple test of Term {Min, Max}

var x = symbolic X initial '';

//Restriction to avoid infinite feasible paths for dynamic analysis
assume x.length < 20;

if (/^(abc){3,}$/.test(x)) {

	if (x.length < 9) {
		throw 'Unreachable';
	}

	if (x == '') {
		throw 'Unreachable';
	}

	if (x == 'abc') {
		throw 'Unreachable';
	}

	if (x == 'abcabc') {
		throw 'Unreachable';
	}

	for (var i = 0; i < x.length; i += 3) {
		if (x.substr(i, 3) != 'abc') {
			throw 'Unreachable';
		}
	}

	throw 'Reachable';
}

throw 'Reachable';
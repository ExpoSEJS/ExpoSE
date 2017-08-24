//Test modeling of looped references to open capture groups (Local captures)

var x = symbolic X initial '';

if (/^(([a-z])\2)+(([1-9])\4)+$/.test(x)) {

	if (x.length == 8) {

		if (x.charAt(0) != x.charAt(1)) {
			throw 'Unreachable';
		}

		if (x.charAt(2) != x.charAt(3)) {
			throw 'Unreachable';
		}

		if (x.charAt(4) != x.charAt(5)) {
			throw 'Unreachable';
		}

		if (x.charAt(6) != x.charAt(7)) {
			throw 'Unreachable';
		}

	}

	throw 'Reachable';
}
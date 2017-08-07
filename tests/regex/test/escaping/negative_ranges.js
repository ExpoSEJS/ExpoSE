var x = symbolic X initial '';

if (/^[^abcd]$/.test(x)) {
	if (x == 'a') throw 'Unreachable';
	if (x == 'b') throw 'Unreachable';
	if (x == 'c') throw 'Unreachable';
	if (x == 'd') throw 'Unreachable';
	throw 'Reachable';
}

if (/^[^a-z]$/.test(x)) {
	
	if (/^[a-z]$/.test(x)) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

if (/^[^0-9]+$/.test(x)) {
	
	if (/^[0-9]$/.test(x)) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
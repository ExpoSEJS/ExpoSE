var x = S$.symbol("X", '');

if (/^\d$/.test(x)) {

	if (!/^[0-9]$/.test(x)) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

if (/^\D$/.test(x)) {

	if (/^[0-9]$/.test(x)) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
var x = symbolic X initial '';

if (/^[a-zA-Z]?$/.test(x)) {
	if (!/^[a-z]$/.test(x)) {
		throw 'Reachable';
	} else {
		throw 'Reachable';
	}
}

if (/^[a-z]$/.test(x)) {
	throw 'Unreachable';
}
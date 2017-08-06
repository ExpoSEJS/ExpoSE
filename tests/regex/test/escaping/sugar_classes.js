var x = symbolic X initial '';

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

if (/^\w$/.test(x)) {
	if (/^\s$/.test(x)) throw 'Unreachable';
	if (/^\d$/.test(x)) throw 'Reachable';
	if (/^\D$/.test(x)) throw 'Reachable';
	if (/^[a-z]$/.test(x)) throw 'Reachable';
	if (/^[A-Z]$/.test(x)) throw 'Reachable';
	if (x == '_') throw 'Reachable';
}

if (/^\W$/.test(x)) {
	if (/^\s$/.test(x)) throw 'Reachable';
	if (/^\d$/.test(x)) throw 'Unreachable';
	if (/^\D$/.test(x)) throw 'Unreachable';
	if (/^[a-z]$/.test(x)) throw 'Unreachable';
	if (/^[A-Z]$/.test(x)) throw 'Unreachable';
	if (x == '_') throw 'Unreachable';
}
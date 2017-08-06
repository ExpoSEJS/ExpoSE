var x = symbolic X initial '';

if (/^\u{EEFF}$/u.test(x)) {
	if (x != '\uEEFF') throw 'Unreachable';
	throw 'Reachable';
}

if (/^\u{EFAF}$/u.test(x)) {
	if (x != '\uEFAF') throw 'Unreachable';
	throw 'Reachable';
}
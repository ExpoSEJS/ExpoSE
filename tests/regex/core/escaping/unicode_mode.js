var x = S$.symbol("X", '');

if (/^\u{EEFF}$/u.test(x)) {
	if (x != '\uEEFF') throw 'Unreachable';
	throw 'Reachable';
}

if (/^\u{EFAF}$/u.test(x)) {
	if (x != '\uEFAF') throw 'Unreachable';
	throw 'Reachable';
}

if (/^\u{AAAA}$/u.test(x)) {
	if (x != '\uAAAA') throw 'Unreachable';
	throw 'Reachable';
}

if (/^\u{FEEE}$/u.test(x)) {
	if (x != '\uFEEE') throw 'Unreachable';
	throw 'Reachable';
}

if (/^\u{4444}$/u.test(x)) {
	if (x != '\u4444') throw 'Unreachable';
	throw 'Reachable';
}
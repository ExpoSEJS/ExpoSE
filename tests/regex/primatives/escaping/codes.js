var x = symbolic X initial '';

if (/^\xFF$/.test(x)) {
	if (x != '\xFF') throw 'Unreachable';
	throw 'Reachable';
}

if (/^\xEF$/.test(x)) {
	if (x != '\xEF') throw 'Unreachable';
	throw 'Reachable';
}

if (/^\0$/.test(x)) {
	if (x == '\x00') throw 'Reachable';
	throw 'Unreachable';
}

//Z3 doesn't support Unicode in RE so these probably won't work (Possibly if expressed as two ASCII characters)
if (/^\uEEFF$/.test(x)) {
	if (x != '\uEEFF') throw 'Unreachable';
	throw 'Reachable';
}

if (/^\u{EEFF}$/u.test(x)) {
	if (x != '\uEEFF') throw 'Unreachable';
	throw 'Reachable';
}
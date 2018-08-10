var x = S$.symbol("X", '');

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
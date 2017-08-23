var x = symbolic X initial '';

if (/^[abcd]$/.test(x)) {
	if (x == 'c') throw 'Reachable';
	if (x == '') throw 'Unreachable';
	if (x == 'e') throw 'Unreachable';
	throw 'Reachable';
}

if (/^[a-z]*$/.test(x)) {
	if (x == 'abcdef') throw 'Reachable';
	if (x == '') throw 'Reachable';
	if (x == '12345') throw 'Unreachable';
	throw 'Reachable';
}

if (/^[0-9]+$/.test(x)) {
	if (x == '12345') throw 'Reachable';
	if (x == '12ab34') throw 'Unreachable';
	if (x == '') throw 'Unreachable';
	throw 'Reachable';
}

throw 'Reachable';
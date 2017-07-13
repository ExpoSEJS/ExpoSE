var x = symbolic X initial '';

if (/^[^abcd]$/.test(x)) {
	if (x == 'c' || x == 'a') throw 'Unreachable';
	if (x == '') throw 'Unreachable';
	if (x == 'e' || x == 'p') throw 'Reachable';
	throw 'Reachable';
}

if (/^[^a-z]*$/.test(x)) {
	if (x == 'abcdef' || x == '123abc') throw 'Unreachable';
	if (x == '') throw 'Reachable';
	if (x == '12345' || x == '1$"£"!%^32131') throw 'Reachable';
	throw 'Reachable';
}

if (/^[^0-9]+$/.test(x)) {
	if (x == '12345' || x == '12ab34') throw 'Unreachable';
	if (x == 'abc') throw 'Reachable';
	if (x == '') throw 'Unreachable';
	throw 'Reachable';
}

throw 'Reachable';
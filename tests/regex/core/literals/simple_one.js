var x = S$.symbol("X", '');

if (/^a$/.test(x)) {
	if (x == 'a') throw 'Reachable';
	throw 'Unreachable';
}
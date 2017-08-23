var x = symbolic X initial '';

if (/^a$/.test(x)) {
	if (x == 'a') throw 'Reachable';
	throw 'Unreachable';
}
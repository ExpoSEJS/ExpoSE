var x = symbolic X initial '';

if (/^hello_world$/.test(x)) {
	if (x == 'hello_world') throw 'Reachable';
	throw 'Unreachable';
}
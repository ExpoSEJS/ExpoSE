var x = symbolic X initial '';

if (/^Hello|Goodbye|Whats Up$/.test(x)) {
	if (x == 'Hello') throw 'Reachable';
	if (x == 'Goodbye') throw 'Reachable';
	if (x == 'Whats Up') throw 'Reachable';
	throw 'Unreachable';
}

throw 'Reachable';
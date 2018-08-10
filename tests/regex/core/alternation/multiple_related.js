var x = S$.symbol("X", '');

if (/^Hello|Goodbye|Whats Up$/.test(x)) {
	if (x == 'Hello') throw 'Reachable';
	if (x == 'Goodbye') throw 'Reachable';
	if (x == 'Whats Up') throw 'Reachable';
	throw 'Unreachable';
}

if (/^Hello|Cookey$/.test(x)) {
	if (x == 'Cookey') throw 'Reachable';
	throw 'Unreachable';
}

if (/^Cookey|Hello|Whats Up$/.test(x)) {
	throw 'Unreachable';
}

if (/^Whats Up|Alice|Bob$/.test(x)) {
	if (x == 'Alice') throw 'Reachable';
	if (x == 'Bob') throw 'Reachable';
	throw 'Unreachable';
}

throw 'Reachable';
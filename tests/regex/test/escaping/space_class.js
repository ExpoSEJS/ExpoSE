//Any whitespace
if (x.test(/^\s$/)) {
	if (x == '\f') throw 'Reachable';
	if (x == '\n') throw 'Reachable';
	if (x == '\r') throw 'Reachable';
	if (x == '\t') throw 'Reachable';
	if (x == '\v') throw 'Reachable';
	if (x == '\u00a0') throw 'Reachable';
	if (x == '\u1680') throw 'Reachable';
	if (x == '\u180e') throw 'Reachable';
	if (x == '\u2000') throw 'Reachable';
	if (x == '\u200a') throw 'Reachable';
	if (x == '\u2028') throw 'Reachable';
	if (x == '\u2029') throw 'Reachable';
	if (x == '\u202f') throw 'Reachable';
	if (x == '\u205f') throw 'Reachable';
	if (x == '\u205f') throw 'Reachable';
	if (x == '\u3000') throw 'Reachable';
	if (x == '\ufeff') throw 'Reachable';
	throw 'Unreachable';
}

//Anything but whitespace
if (x.test(/^\S$/)) {
	if (x == '\f') throw 'Unreachable';
	if (x == '\n') throw 'Unreachable';
	if (x == '\r') throw 'Unreachable';
	if (x == '\t') throw 'Unreachable';
	if (x == '\v') throw 'Unreachable';
	if (x == '\u00a0') throw 'Unreachable';
	if (x == '\u1680') throw 'Unreachable';
	if (x == '\u180e') throw 'Unreachable';
	if (x == '\u2000') throw 'Unreachable';
	if (x == '\u200a') throw 'Unreachable';
	if (x == '\u2028') throw 'Unreachable';
	if (x == '\u2029') throw 'Unreachable';
	if (x == '\u202f') throw 'Unreachable';
	if (x == '\u205f') throw 'Unreachable';
	if (x == '\u205f') throw 'Unreachable';
	if (x == '\u3000') throw 'Unreachable';
	if (x == '\ufeff') throw 'Unreachable';
	throw 'Reachable';
}
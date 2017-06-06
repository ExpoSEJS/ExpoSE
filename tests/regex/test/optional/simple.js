//Simple optional enumerates all strings possible from a simple optional

var x = symbolic X initial '';

if (/^a?b?c?$/.test(x)) {
	if (x == '') throw 'Reachable';
	if (x == 'a') throw 'Reachable';
	if (x == 'b') throw 'Reachable';
	if (x == 'c') throw 'Reachable';
	if (x == 'ab') throw 'Reachable';
	if (x == 'ac') throw 'Reachable';
	if (x == 'bc') throw 'Reachable';
	if (x == 'abc') throw 'Reachable';
	throw 'Unreachable';
}
var x = symbolic X initial '';

if (/(hello)*?(world)*?/.test(x)) {
	if (x == '') throw 'Reachable';
	if (x == 'hellohelloworld') throw 'Reachable';
	if (x == 'd') throw 'Unreachable';
	if (x == 'hellohelloworl') throw 'Unreachable';
	if (x == 'worldworldworld') throw 'Reachable';
}
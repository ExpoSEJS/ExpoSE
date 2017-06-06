var x = symbolic X initial '';

if (/^he*llo_world*$/.test(x)) {
	if (x == 'heello_worlddddd') throw 'Reachable';
	if (x == 'hllo_worl') throw 'Reachable';
	if (x == '') throw 'Unreachable';
}
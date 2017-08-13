var x = symbolic X initial '';
var b = /^([a-z])$/.exec(x);

if (b) {
	if (b[1] == 'a') throw 'Reachable';
	throw 'Reachable';
}
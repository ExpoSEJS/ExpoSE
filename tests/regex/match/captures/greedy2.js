var x = symbolic X initial '';
var regex = /^([a-z])$/;
var b = x.match(regex);

if (b) {
	if (b[1] == 'a') throw 'Reachable';
	throw 'Reachable';
}
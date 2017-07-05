//In this test a string constraint is used to force a relation between two captured strings

var x = symbolic X initial '';
var b = /(.+)q(.+)/.exec(x);

if (b) {
	if (b[1] == b[2]) throw 'Reachable';
	throw 'Reachable';
}
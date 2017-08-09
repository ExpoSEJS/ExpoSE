//In this test a string constraint is used to force a relation between two captured strings

var x = symbolic X initial '';
var b = /(.+)q(.+)/.exec(x);

assume x.length < 20;

if (b) {
	if (b[1] == b[2]) throw 'Reachable';
	throw 'Reachable';
}
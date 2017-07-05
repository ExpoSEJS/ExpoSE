//Test greedyness brought on by ambiguities in quantifiers

var x = symbolic X initial '';
var b = /^(hello)+(.+)$/.exec(x);

if (b) {
	if (b[1].length < b[2].length) throw 'Unreachable';
	if (b[2].length > 1) throw 'Unreachable';
	if (b[2] == 'hello') throw 'Unreachable';
	throw 'Reachable';
}
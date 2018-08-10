//Test greedyness brought on by ambiguities in quantifiers

var x = S$.symbol("X", '');
var regex = /^(hello)+(.+)$/;
var b = x.match(regex);

if (b) {
	if (b[1].length < b[2].length) throw 'Unreachable';
	if (b[2].length > 1) throw 'Unreachable';
	if (b[2] == 'hello') throw 'Unreachable';
	throw 'Reachable';
}
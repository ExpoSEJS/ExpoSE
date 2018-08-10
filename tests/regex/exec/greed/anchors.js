//Test ambiguities brought about by greediness and anchors

var x = S$.symbol("X", '');
var b = /.../.exec(x);

if (b) {
	if (x.length == 3) throw 'Reachable';
	if (x.length > 9) throw 'Reachable';
	if (b[0].length != 3) throw 'Unreachable';
	throw 'Reachable';
}
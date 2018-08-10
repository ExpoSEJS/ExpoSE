//Test ambiguities brought about by greediness and anchors
var S$ = require('S$');
var x = S$.symbol("X", '');
var regex = /.../
var b = x.match(regex);

if (b) {
	if (x.length == 3) throw 'Reachable';
	if (x.length > 9) throw 'Reachable';
	if (b[0].length != 3) throw 'Unreachable';
	throw 'Reachable';
}
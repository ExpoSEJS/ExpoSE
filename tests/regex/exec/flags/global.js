var S$ = require('S$');
var x = S$.symbol("X", '');
var b = /abc/g.exec(x);

S$.assume(x.length < 4);

if (b.exec(x)) {
	
	if (b.exec(x)) {
		//As string length is < 4 two abc is unreachable
		throw 'Unreachable';
	}

	//One abc is reachable
	throw 'Reachable';
}

throw 'Reachable';
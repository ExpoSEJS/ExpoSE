var x = symbolic X initial '';
var b = /abc/g.exec(x);

assume x.length < 4;

if (b.exec(x)) {
	
	if (b.exec(x)) {
		//As string length is < 4 two abc is unreachable
		throw 'Unreachable';
	}

	//One abc is reachable
	throw 'Reachable';
}

throw 'Reachable';
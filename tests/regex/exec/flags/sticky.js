//Test the lastIndex property of the sticky flag

var x = symbolic X initial '';
var b = /abc/y.exec(x);

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
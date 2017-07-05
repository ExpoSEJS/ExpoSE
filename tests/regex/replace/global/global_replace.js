//Tests replace on a global regex

var x = symbolic X initial '';
var b = /(a|b)/g;

if (x != 'Test' && x.replace(b, 'Test') == 'Test') {
	
	//In a global replace all instances should go
	if (x.indexOf('a') != -1 || x.indexOf('b') != -1) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

throw 'Reachable';
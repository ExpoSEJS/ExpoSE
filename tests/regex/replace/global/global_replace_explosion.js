//Generate a test case 

var x = symbolic X initial '';
var b = /(a|b)/g;

assume x.length > 1000;
assume x[786] = 'b';

if (x.replace(b, 'Test') == 'Test') {
	
	//In a global replace all instances should go
	if (x.indexOf('a') != -1 || x.indexOf('b') != -1) {
		throw 'Unreachable';
	}

	if (x[768] != 'T') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

throw 'Reachable';
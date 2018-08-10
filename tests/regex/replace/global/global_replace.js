//Tests replace on a global regex

var x = S$.symbol("X", '');
var b = /(a|b)/g;

S$.assume(x.length < 5);

if (x != 'Test' && x.replace(b, 'Test') == 'Test') {
	
	//In a global replace all instances should go
	if (x.indexOf('a') != -1 || x.indexOf('b') != -1) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

throw 'Reachable';
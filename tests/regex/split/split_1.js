//Tests replace on a global regex

var x = S$.symbol("X", '');
var b = /(a)/;

S$.assume(x.length < 5);

x = x.split(b);

if (x.length == 2) {

	if (x[0] == 'hello') {
		throw 'Unreachable'; //Broken by the assumption on string length
	}

	if (x[1] == 'wh') {
		throw 'Reachable';
	}

	if (x[0] == 'w') {
		throw 'Reachable';
	}
}
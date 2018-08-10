//Tests replace on a global regex

var x = S$.symbol("X", '');
var b = /(a)/;

x = x.split(b);

S$.assume(x.length < 100);

if (x.length == 16) {
	if (x[x.length - 1] == 'hello') {
		throw 'Unreachable'; //Broken by the assumption on string length
	}
}
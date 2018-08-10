//Tests replace on a global regex

var x = S$.symbol("X", '');
var b = /(a)/;

S$.assume(x.length < 5);

x = x.split(b);

if (x.length > 0 && x[0] == 'hi') {
	throw 'Reachable';
}
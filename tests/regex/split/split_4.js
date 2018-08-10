//Tests replace on a global regex

var x = S$.symbol("X", '');
var b = /(a)/;

S$.assume(x.length < 5);

x = x.split(b);

for (var i = 0; i < x.length; i++) {
	if (x[i] == 'a') {
		throw 'Unreachable';
	}
}
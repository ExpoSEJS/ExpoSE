//Tests replace on a global regex

var x = symbolic X initial '';
var b = /(a)/;

assume x.length < 5;

x = x.split(b);

for (var i = 0; i < x.length; i++) {
	if (x[i] == 'a') {
		throw 'Unreachable';
	}
}
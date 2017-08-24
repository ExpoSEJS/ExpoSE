//Tests replace on a global regex

var x = symbolic X initial '';
var b = /(a)/;

assume x.length < 5;

x = x.split(b);

if (x.length == 6) {
	throw 'Unreachable';
}
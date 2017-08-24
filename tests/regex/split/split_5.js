//Tests replace on a global regex

var x = symbolic X initial '';
var b = /.../;

assume x.length < 2;

x = x.split(b);

if (x.length > 1) {
	throw 'Unreachable';
}

if (x.length == 1) {
	throw 'Reachable';
}
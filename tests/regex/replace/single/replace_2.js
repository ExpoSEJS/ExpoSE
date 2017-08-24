//Tests a replace on a non global regex

var x = symbolic X initial 'a';
var b = /^(a|b)$/;

x = x.replace(b, 'hello');

if (x == 'hello') {
	throw 'Reachable';
}

if (x == 'a') {
	throw 'Unreachable';
}

if (x == 'b') {
	throw 'Unreachable';
}
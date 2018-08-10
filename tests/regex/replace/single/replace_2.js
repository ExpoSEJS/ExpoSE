//Tests a replace on a non global regex

var x = S$.symbol("X", 'a');
var b = /^(a|b)$/;

x = x.replace(b, 'hello');

console.log('X is ' + x);

if (x == 'hello') {
	throw 'Reachable';
}

if (x == 'a') {
	throw 'Unreachable';
}

if (x == 'b') {
	throw 'Unreachable';
}
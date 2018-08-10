//Tests a replace on a non global regex

var x = S$.symbol("X", 'a');
var b = /^...$/;

x = x.replace(b, 'abdef');

if (x == 'hello') {
	throw 'Reachable';
}

if (x == 'abc') {
	throw 'Unreachable';
}

if (x == 'def') {
	throw 'Unreachable';
}

if (x == 'abdef') {
	throw 'Reachable';
}
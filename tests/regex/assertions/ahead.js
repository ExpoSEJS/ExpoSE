var x = S$.symbol("X", '');

var re1 = /^a(?=b)c$/;

if (re1.test(x)) {
	throw 'Unreachable';
}
//Tests replace on a global regex

var x = symbolic X initial '';
var b = /(a|b)/g;

x = x.replace(b, 'q');

for (var i = 0; i < x.length; i++) {
	if (x[i] == 'a') {
		throw 'Unreachable';
	}

	if (x[i] == 'b') {
		throw 'Unreachable';
	}
}
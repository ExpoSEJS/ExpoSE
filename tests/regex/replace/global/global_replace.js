//Tests replace on a global regex

var x = symbolic X initial '';
var b = /(a|b)/g;

if (x != 'Test' && x.replace(b, 'Test') == 'Test') {
	throw 'Reachable';
}

throw 'Reachable';
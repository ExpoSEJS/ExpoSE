//Tests a replace on a non global regex

var x = symbolic X initial '';
var b = /(a|b)/;

if (x != 'Test' && x.replace(b, 'Test') == 'Test') {
	throw 'Reachable';
}

throw 'Reachable';
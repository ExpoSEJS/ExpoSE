var re = /hello/y;
var x = symbolic X initial '';

assume x.length < 15;

var i = 0;

while (x.match(re)) {
	i++;
}

if (x > 3) {
	throw 'Unreachable';
}

throw 'Reachable';
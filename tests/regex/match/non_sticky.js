var re = /hello/y;
var x = symbolic X initial '';

assume x.length < 15;

var m1 = x.match(re);
var m2 = x.match(re);

assume m1;

if (m1.index != m2.index) {
	throw 'Unreachable';
}
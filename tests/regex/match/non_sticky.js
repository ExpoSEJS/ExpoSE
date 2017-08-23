var re = /hello/y;
var x = symbolic X initial '';

assume x.length < 15;

var m1 = x.match(re);
var m2 = x.match(re);

if (m1 && m2 && m1.index != m2.index) {
	throw 'Unreachable';
}
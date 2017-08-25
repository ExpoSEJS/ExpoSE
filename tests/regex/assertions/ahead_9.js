var x = symbolic X initial '';

var re = /^(?=(..))[a-z]+$/;

var r = re.exec(x);

if (r) {
	throw 'Reachable';
}
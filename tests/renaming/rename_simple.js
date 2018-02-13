//Test variable renaming scheme

var x = symbolic X initial 0;
var y = symbolic X initial 10;

console.log('Wat');

if (x == 5) {
} else {
	if (x == y) {
		throw 'Reachable 1';
	}

	throw 'Reachable 2';
}
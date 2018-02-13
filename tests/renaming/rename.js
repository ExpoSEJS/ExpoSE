//Test variable renaming scheme

var x = symbolic X;
var y = symbolic X initial 10;

console.log('Wat');

if (x == y) {
	throw 'Reachable 1';
}

throw 'Reachable 2';
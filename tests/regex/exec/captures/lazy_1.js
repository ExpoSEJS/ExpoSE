//Test the lastIndex property of the sticky flag

var x = symbolic X initial '';
var b = /^a*?(a)?$/y.exec(x);

if (b != null) {
	console.log('B1: ' + b[1]);
	
	if (b[1] == 'a') {
		throw 'Reachable';
	}

	throw 'Reachable';
}
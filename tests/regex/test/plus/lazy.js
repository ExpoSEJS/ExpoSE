//Same as plus.js
//Tries to show that +? and + are equivalent for test

var x = symbolic X initial '';

if (/^(hello)+?(world)+?$/.test(x)) {

	if (x.length == 0) {
		throw 'Unreachable';
	}

	if (x == '') {
		throw 'Unreachable';
	}

	if (x == 'hellohelloworld') {
		throw 'Reachable';
	}

	throw 'Reachable';
}

if (/^he+?l+?l+?o_wor+?l+?d+?$/.test(x)) {
	
	if (x == 'helllllo_world') {
		throw 'Reachable';
	}

	if (x == 'hello_world') {
		throw 'Reachable';
	}

	if (x == 'hellooooo_world') {
		throw 'Unreachable';
	}

	if (x.length == 0) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

if (/^h+?$/.test(x)) {

	if (/^[^h]+$/.test(x)) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
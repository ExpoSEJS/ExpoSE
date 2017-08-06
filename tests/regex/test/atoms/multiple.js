var x = symbolic X initial '';

if (/HELLO WORLD/.test(x)) {
	throw 'Reachable';
}

if (/GOODBYE WORLD/.test(x)) {
	throw 'Reachable';
}

if (/AND ME/.test(x)) {
	throw 'Reachable';
}

if (/YEP YEP YEP/.test(x)) {
	throw 'Reachable';
}

if (/£"£!£%"£$£$%£$"£/.test(x)) {
	throw 'Reachable';
}

throw 'Reachable';
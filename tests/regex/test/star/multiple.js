var x = symbolic X initial '';

if (/^he*llo_world*$/.test(x)) {
	throw 'Reachable';
}

if (/^(hello)*(world)*$/.test(x)) {
	throw 'Reachable';
}

if (/^he*llo_world*$/.test(x)) {
	throw 'Unreachable';
}

if (/^(hello)*(world)*$/.test(x)) {
	throw 'Unreachable';
}

if (/^a*$/.test(x)) {
	throw 'Reachable';
}

if (/^b*$/.test(x)) {
	throw 'Reachable';
}

throw 'Reachable';
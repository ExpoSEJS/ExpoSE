var x = S$.symbol("X", '');

if (/^(a)\1+$/.test(x)) {
	throw 'Reachable';
}
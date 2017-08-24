var x = symbolic X initial '';

if (/^(a)\1+$/.test(x)) {
	throw 'Reachable';
}
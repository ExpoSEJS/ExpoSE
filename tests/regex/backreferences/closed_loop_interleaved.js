var x = symbolic X initial '';

if (/^(a)([a-z])(hello)(....)\4\3\1$/.test(x)) {
	throw 'Reachable';
}
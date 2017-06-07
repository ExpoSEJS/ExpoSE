//Simple test of Term {Min, Max}

var x = symbolic X initial '';

if (/^(abc){3}$/.test(x)) {
	if (x == 'abcabcabc') throw 'Reachable';
	throw 'Unreachable';
}

if (/^a{3}$/.test(x)) {
	if (x == 'aaa') throw 'Reachable';
	throw 'Unreachable';
}
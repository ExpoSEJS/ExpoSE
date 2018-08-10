//Simple test of Term {X}

var x = S$.symbol("X", '');

if (/^(abc){3}$/.test(x)) {
	if (x == 'abcabcabc') throw 'Reachable';
	throw 'Unreachable';
}

if (/^a{3}$/.test(x)) {
	if (x == 'aaa') throw 'Reachable';
	throw 'Unreachable';
}
//Simple test of Term {Min, Max}

var x = symbolic X initial '';

if (/^(abc){3,6}$/.test(x)) {
	if (x == 'abcabcabc') throw 'Reachable';
	if (x == 'abcabcabcabc') throw 'Reachable';
	if (x == 'abcabcabcabcabc') throw 'Reachable';
	if (x == 'abcabcabcabcabcabc') throw 'Reachable';
	throw 'Unreachable';
}

if (/^a{0,3}$/.test(x)) {
	if (x == '') throw 'Reachable';
	if (x == 'a') throw 'Reachable';
	if (x == 'aa') throw 'Reachable';
	if (x == 'aaa') throw 'Reachable';
	throw 'Unreachable';
}
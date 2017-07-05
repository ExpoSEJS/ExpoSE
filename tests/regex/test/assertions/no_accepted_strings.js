var x = symbolic X initial '';

if (/a(?=b)c/.test(x)) {
	throw 'Unreachable';
}

//Capture some text in an assertion
if (/a(?=(a))a/.test(x)) {
	var caps = /a(?=(a))a/.exec(x);

	if (caps[1] == 'a') {
		throw 'Reachable';
	} else {
		throw 'Unreachable';
	}
}

throw 'Reachable';
var x = S$.symbol("X", '');

if (/^\w$/.test(x)) {
	if (!/^[a-zA-Z0-9_]$/.test(x)) {
		throw 'Unreachable';
	} else {
		throw 'Reachable';
	}
}

if (/^\W$/.test(x)) {
	if (/^[a-zA-Z0-9_]$/.test(x)) {
		throw 'Unreachable';
	} else {
		throw 'Reachable';
	}
}
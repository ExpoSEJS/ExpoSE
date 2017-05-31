var x = symbolic X initial '';

//Form Feed
if (/^\f$/.test(x)) {
	if (x == '\f') throw 'Reachable';
	throw 'Unreachable';
}

//Backspace
if (/^[\b]$/.test(x)) {
	if (x == '\b') throw 'Reachable';
	throw 'Unreachable';
}

//Tabs
if (x.test(/^\t$/)) {
	if (x == 't') throw 'Reachable';
	throw 'Unreachable';
}

//Vertical Tab
if (x.test(/^\v$/)) {
	if (x == '\v') throw 'Reachable';
	throw 'Unreachable';
}

//CR
if (x.test(/^\n$/)) {
	if (x == '\n') throw 'Reachable';
	throw 'Unreachable';
}
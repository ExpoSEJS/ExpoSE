var x = S$.symbol("X", '');

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
if (/^\t$/.test(x)) {
	if (x == '\t') throw 'Reachable';
	throw 'Unreachable';
}

//Vertical Tab
if (/^\v$/.test(x)) {
	if (x == '\v') throw 'Reachable';
	throw 'Unreachable';
}

//CR
if (/^\n$/.test(x)) {
	if (x == '\n') throw 'Reachable';
	throw 'Unreachable';
}
var S$ = require('S$');
var x = S$.symbol("X", '');

if (/^[^abcd]$/.test(x)) {
	if (x == 'a') throw 'Unreachable';
	if (x == 'b') throw 'Unreachable';
	if (x == 'c') throw 'Unreachable';
	if (x == 'd') throw 'Unreachable';
	throw 'Reachable';
}

if (/^[^a-z]$/.test(x)) {
	
	//Definitely unreachable given this if should never be entered
	if (/^[a-z]$/.test(x)) {
		throw 'Unreachable';
	}

	//This is unreachable as any section that is caught by [^a-z] will be caught by [^abcd]
	throw 'Unreachable';
}

if (/^[^0-9]$/.test(x)) {
	
	if (/^[0-9]$/.test(x)) {
		throw 'Unreachable';
	}

	throw 'R3';
}
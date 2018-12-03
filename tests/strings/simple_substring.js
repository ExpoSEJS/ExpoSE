var S$ = require('S$');

var arg = S$.symbol("arg", "");

if (arg.substr(0, 5) == "hello") {
	throw 'Reachable 1';
}

if (arg.substr(0, 5) == "goodbye") {
	throw 'Unreachable';
}

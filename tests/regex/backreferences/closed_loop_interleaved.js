var S$ = require('S$');
var x = S$.symbol("X", '');

if (/^(a)([a-z])(hello)(....)\4\3\1$/.test(x)) {
	throw 'Reachable';
}
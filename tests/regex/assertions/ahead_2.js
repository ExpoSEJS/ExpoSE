var S$ = require('S$');
var x = S$.symbol("X", '');

var re2 = /^a(?=(a))a$/;
 
//Capture some text in an assertion
if (re2.test(x)) {
	var caps = re2.exec(x);

	if (caps[1] == 'a') {
		throw 'Reachable';
	} else {
		throw 'Unreachable';
	}
}

var S$ = require('S$');
var a = S$.symbol('A', '');

S$.assume(a.length <= 20);

var res = a.match(/Testi/g);

//Test that other string constraints will still get generated after a match
if (a == "HotDog") {
	throw 'Reachable';
} 

//Test that we can find this enumeration-required case in a match operation
if (res) {
	for (var i = 0; i < res.length; i++) {
		if (i == 3) {
			throw 'Reachable';
		}
	}
}

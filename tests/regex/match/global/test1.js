var S$ = require('S$');
var a = S$.symbol('A', '');

S$.assume(a.length < 20);

var res = a.match(/Tst/g);

if (res) {
	for (var i = 0; i < res.length; i++) {
	}
}

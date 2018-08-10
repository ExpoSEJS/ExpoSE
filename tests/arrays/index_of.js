var S$ = require('S$');
var x = S$.symbol('X', [1]);

if (x.indexOf(5) != -1) {
    throw 'Hi';
}

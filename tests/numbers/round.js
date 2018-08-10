var S$ = require('S$');

var value = S$.symbol('VALUE', 1);
var decimal = S$.symbol('DECIMAL', 3);
var rounded = Math.round(decimal);

if (value != rounded) {
    throw 'R1';
} else {
    throw 'R2';
}

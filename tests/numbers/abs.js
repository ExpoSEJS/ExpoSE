var S$ = require('S$');
var x = S$.symbol('X', 0);

if (Math.abs(x) == x) {
    throw 'R1';
} else {
    throw 'R2';
}

var S$ = require('S$');
var x = S$.pureSymbol('X');
var y = S$.pureSymbol('Y');

if (x == y) {
    throw 'Reachable';
}

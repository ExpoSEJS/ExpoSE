var S$ = require('S$');
var x = S$.symbol('X', [1]);

if (x.includes(54)) {
    throw 'Reachable 1';
}

var S$ = require('S$');
var x = S$.symbol('X', 0);

if ([1,2,3][x]) {
    throw 'Reachable';
}

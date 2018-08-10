var S$ = require('S$');

var q = S$.symbol('X', [1]);
var qq = S$.symbol('X', 5);

if (q.length == 5) {
    q[3] = qq;

    if (q[3] != qq) {
        throw 'Unreachable';
    }

    throw 'Reached';
}

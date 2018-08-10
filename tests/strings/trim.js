var S$ = require('S$');
var x = S$.symbol("X", '');

S$.assume(x.length == 15);

if (x.trim() == 'Hello') {
    throw 'Reachable';
}

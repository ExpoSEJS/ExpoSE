var S$ = require('S$');
var stdargs = S$.symbol('X', ['P']);

if (stdargs[3] == 'Hello') {

    if (!stdargs.includes('Hello')) {
        throw 'Unreachable';
    }

    throw 'Reachable'; 
}

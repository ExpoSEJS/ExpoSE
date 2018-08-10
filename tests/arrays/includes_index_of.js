var S$ = require('S$');
var x = S$.symbol('X', ['Hi']);

if (x.indexOf('What') != -1) {

    if (!x.includes('What')) {
        throw 'Unreachable';
    }

    throw 'Reachable';
}

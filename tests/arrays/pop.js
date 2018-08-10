var S$ = require('S$');
var x = S$.symbol('X', ['hi']);

if (x.length == 1) {

    console.log('X is ' + x);

    x.push('vvv');

    console.log('X is ' + x + ' with length ' + x.length);

    if (x.length != 2) {
        throw 'Unreachable 1';
    }

    if (x[1] != 'vvv') {
        throw 'Unreachable 2';
    }

    throw 'Reachable';
}

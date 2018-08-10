var S$ = require('S$');

var x = {
    a: 'hi',
    b: 'bob',
    c: 'john'
}

var a = x[S$.symbol('X', '')];

if (a && a == 'john') {
    console.log('I SHOULD BE REACHABLE!!')
    throw 'Reachable';
}
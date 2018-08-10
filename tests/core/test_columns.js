var S$ = require('S$');

var x = S$.symbol('X', 5);

if (x) {
    console.log('Hi');

    if (!x) {
        console.log('Bye');
    }
}

var S$ = require('S$');
var x = S$.symbol('X', ['h']);

if (x[0] + undefined) {
    throw 'What';
}

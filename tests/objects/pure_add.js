var S$ = require('S$');
var X = S$.symbol('X', [0]);

if (X + undefined) {
    throw 'What';
}

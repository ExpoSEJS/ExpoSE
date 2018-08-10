var S$ = require('S$');

var x = {};

x[4] = 'Hi';

x['Hello'] = 32;

x[false] = true;

S$.assert(x[false] == true);
S$.assert(x['Hello'] = 32);
S$.assert(x[4] == 'Hi');

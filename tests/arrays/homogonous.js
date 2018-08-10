"use strict";

var S$ = require('S$');
 
// Expecting three paths
var q = S$.symbol('UnderTest', [false]);

if (q[0] === true) {
	throw 'Reachable 1';
} else if (typeof q[0] === 'boolean') {
	console.log('Another boolean value');
    throw 'Reachable 2';
} else  {
    throw 'Reachable 3';
}

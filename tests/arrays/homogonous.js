"use strict";
 
// Expecting three paths
var q = symbolic UnderTest initial [false];

if (q[0] === true) {
	throw 'Reachable 1';
} else if (typeof q[0] === 'boolean') {
	console.log('Another boolean value');
    throw 'Reachable 2';
} else  {
    throw 'Reachable 3';
}

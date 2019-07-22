"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
A = new A([]);

let f = function(x) {
	S$.enforce(x, A);
	return x
}
let res = f(S$.annotate(true, A));

S$.assert(res, "Annotation Check Failed")
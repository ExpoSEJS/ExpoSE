"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
var B = S$.SecAnn("B", A);
var C = S$.SecAnn("C", B);

A = new A([]);
B = new B([]);
C = new C([]);

let f = function(x) {
	S$.enforce(x, A);
	return x
}

let res = f(S$.annotate(true, C));
S$.assert(res, "Annotation Check Failed");
"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
var B = S$.SecAnn("B");
A = new A([]);
B = new B([]);

let f = function(x) {
	S$.enforce(x, A);
	return x
}
let res = f(S$.annotate("val1", A));
S$.assert(res, "Annotation Check Failed")

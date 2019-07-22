"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
var B = S$.SecAnn("B");
A = new A([]);
B = new B([]);

let f = function(x) {
	S$.enforce(x, new S$.Top([]));
	return x
}

let res = f(S$.annotate(S$.annotate(true, B), A));
S$.assert(res, "Annotation Check Failed");
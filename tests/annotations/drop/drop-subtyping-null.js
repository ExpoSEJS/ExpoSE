"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
var B = S$.SecAnn("B", A);
var C = S$.SecAnn("C", B);
A = new A([]);
B = new B([]);
C = new C([]);

try {
	res = S$.drop(S$.annotate(null, C), B);
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}

S$.assert(!res, "annotation incorrectly added to null");
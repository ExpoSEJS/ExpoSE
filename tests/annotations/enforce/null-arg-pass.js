"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
var B = S$.SecAnn("B");
A = new A([]);
B = new B([]);

try {
	let f = function(x) {
		S$.enforce(x, new S$.Top([]));
		return true
	}
	let res = f(null);
	S$.assert(res, "Annotation Check Error")
} catch (e) {
	S$.assert(e === "FailedSecurityCheck", "Annotation Check Error")
}
"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
var B = S$.SecAnn("B", A);
A = new A([]);
B = new B([]);

try {
	let f = function(x) {
		S$.enforce(x, A);
		return true
	}
	let res = f(null);
	S$.assert(res, "Annotation Check Error")
} catch (e) {
	S$.assert(e === "FailedSecurityCheck", "Annotation Check Error")
}
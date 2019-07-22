"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
var B = S$.SecAnn("B");
A = new A([]);
B = new B([]);

let f = function(x) {
	S$.enforce(x, A);
	return true;
}

let obj = S$.annotate({field1: "val", field2: 1}, A);
obj.field3 = "changedVal";

try {
	let res = f(obj);
	S$.assert(res, "Annotation error not thrown")
} catch (e) {
	S$.assert(e === "FailedSecurityCheck", "A not dropped")
}

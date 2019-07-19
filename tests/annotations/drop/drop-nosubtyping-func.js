"use strict";
var S$ = require('S$');

var A = new (S$.SecAnn("A"))([]);

var res;
try {
	res = S$.annotate(function(x){ return x }, A);
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}

S$.assert(!res, "annotation incorrectly added to function");
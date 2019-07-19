"use strict";
var S$ = require('S$');

var A = new (S$.SecAnn("A"))([]);
var B = new (S$.SecAnn("B"))([]);
const val = function(x) { return x; };

var a, b, res;

b = S$.annotate(true, A);
try {
	a = S$.annotate(val, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");

b = S$.annotate(1, A);
a = undefined;
res = undefined;
try {
	a = S$.annotate(val, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");


b = S$.annotate("string", A);
a = undefined;
res = undefined;
try {
	a = S$.annotate(val, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");

b = S$.annotate({field1: "val1", field2: "val2"}, A);
a = undefined;
res = undefined;
try {
	a = S$.annotate(val, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");


res = undefined;
b = undefined;
a = undefined;
try {
	b = S$.annotate(function(x) { return x; }, A);
	a = S$.annotate(val, B)
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");

res = undefined;
b = undefined;
a = undefined;
try {
	b = S$.annotate(null, A);
	a = S$.annotate(val, B)
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");

res = undefined;
b = undefined;
a = undefined;
try {
	b = S$.annotate(undefined, A);
	a = S$.annotate(val, B)
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");
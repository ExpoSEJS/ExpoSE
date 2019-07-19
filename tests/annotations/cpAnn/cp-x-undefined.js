"use strict";
var S$ = require('S$');

var A = new (S$.SecAnn("A"))([]);
var B = new (S$.SecAnn("B"))([]);
const val = undefined;

var a, b, res;

a = S$.annotate(true, A);
try {
	b = S$.annotate(val, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");

a = S$.annotate(1, A);
b = undefined;
res = undefined;
try {
	b = S$.annotate(val, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");


a = S$.annotate("string", A);
b = undefined;
res = undefined;
try {
	b = S$.annotate(val, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");

a = S$.annotate({field1: "val1", field2: "val2"}, A);
b = undefined;
res = undefined;
try {
	b = S$.annotate(val, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");


res = undefined;
a = undefined;
b = undefined;
try {
	a = S$.annotate(function(x) { return x; }, A);
	b = S$.annotate(val, B)
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");

res = undefined;
a = undefined;
b = undefined;
try {
	a = S$.annotate(null, A);
	b = S$.annotate(val, B)
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");

res = undefined;
a = undefined;
b = undefined;
try {
	a = S$.annotate(undefined, A);
	b = S$.annotate(val, B)
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied to non-annotable");
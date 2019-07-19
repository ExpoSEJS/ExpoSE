"use strict";
var S$ = require('S$');

var A = new (S$.SecAnn("A"))([]);
var B = new (S$.SecAnn("B"))([]);
const val = "string";

var a = S$.annotate(true, A);
var b = S$.annotate(val, B);
var res = S$.cpAnn(a, b);

S$.assert(res === val, "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!> * B<!!>!>", "annotation not copied");

a = S$.annotate(1, A);
b = S$.annotate(val, B)
res = S$.cpAnn(a, b);

S$.assert(res === val, "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!> * B<!!>!>", "annotation not copied");

a = S$.annotate("string", A);
b = S$.annotate(val, B)
res = S$.cpAnn(a, b);

S$.assert(res === val, "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!> * B<!!>!>", "annotation not copied");

a = S$.annotate({field1: "val1", field2: "val2"}, A);
b = S$.annotate(val, B)
res = S$.cpAnn(a, b);

S$.assert(res === val, "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!> * B<!!>!>", "annotation not copied");

res = undefined;
a = undefined;
b = S$.annotate(val, B)
try {
	a = S$.annotate(function(x) { return x; }, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied from non-annotable");

res = undefined;
a = undefined;
b = S$.annotate(val, B)
try {
	a = S$.annotate(null, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied from non-annotable");

res = undefined;
a = undefined;
b = S$.annotate(val, B)
try {
	a = S$.annotate(undefined, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied from non-annotable");
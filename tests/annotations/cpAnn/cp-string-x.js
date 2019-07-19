"use strict";
var S$ = require('S$');

var A = new (S$.SecAnn("A"))([]);
var B = new (S$.SecAnn("B"))([]);
const val = false;

var a, b, res;

b = S$.annotate(true, A);
a = S$.annotate(val, B);
res = S$.cpAnn(a, b);

S$.assert(res === true, "value lost");
S$.assert(S$.annotations(res) === "Top<!B<!!> * A<!!>!>", "annotation not copied");

b = S$.annotate(1, A);
a = S$.annotate(val, B)
res = S$.cpAnn(a, b);

S$.assert(res === 1, "value lost");
S$.assert(S$.annotations(res) === "Top<!B<!!> * A<!!>!>", "annotation not copied");

b = S$.annotate("string", A);
a = S$.annotate(val, B)
res = S$.cpAnn(a, b);

S$.assert(res === "string", "value lost");
S$.assert(S$.annotations(res) === "Top<!B<!!> * A<!!>!>", "annotation not copied");

b = S$.annotate({field1: "val1", field2: "val2"}, A);
a = S$.annotate(val, B)
res = S$.cpAnn(a, b);

S$.assert(S$.annotations(res) === "Top<!B<!!> * A<!!>!>", "annotation not copied");

res = undefined;
b = undefined;
a = S$.annotate(val, B)
try {
	b = S$.annotate(function(x) { return x; }, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied from non-annotable");

res = undefined;
b = undefined;
a = S$.annotate(val, B)
try {
	b = S$.annotate(null, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied from non-annotable");

res = undefined;
b = undefined;
a = S$.annotate(val, B)
try {
	b = S$.annotate(undefined, A);
	res = S$.cpAnn(a, b)
} catch (e) {
	S$.assert(e === "NotAnnotatable", "Incorrect error should be NotAnnotatable");
}
S$.assert(!res, "annotation incorrectly added/copied from non-annotable");
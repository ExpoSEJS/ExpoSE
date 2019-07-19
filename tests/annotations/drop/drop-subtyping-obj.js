"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
var B = S$.SecAnn("B", A);
var C = S$.SecAnn("C", B);
A = new A([]);
B = new B([]);
C = new C([]);

var res = S$.drop(S$.annotate({field1: 'val1', field2: 'val2'}, C), B);

S$.assert(res === {field1: 'val1', field2: 'val2'}, "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!>!>", "annotation not dropped");
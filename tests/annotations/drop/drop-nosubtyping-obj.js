"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
var B = S$.SecAnn("B");
A = new A([]);
B = new B([]);

var res = S$.drop(S$.annotate(S$.annotate({field1: "val1", field2: "val2"}, A), B), B);

S$.assert(res === {field1: "val1", field2: "val2"}, "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!>!>", "annotation not dropped");
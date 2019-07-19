"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
var B = S$.SecAnn("B", A);
var C = S$.SecAnn("C", B);
var D = S$.SecAnn("D");
A = new A([]);
B = new B([]);
C = new C([]);
C = new D([]);

var res = S$.drop(S$.drop(S$.annotate((S$.annotate(true, C), D), B)), D);

S$.assert(res === true, "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!>!>", "annotations not dropped");
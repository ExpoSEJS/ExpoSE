"use strict";
var S$ = require('S$');

var A = new (S$.SecAnn("A"))([]);
var res = S$.annotate("string", A);

S$.assert(res === "string", "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!>!>", "annotation lost");
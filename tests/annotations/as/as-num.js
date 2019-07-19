"use strict";
var S$ = require('S$');

var A = new (S$.SecAnn("A"))([]);
var res = S$.annotate(1, A);

S$.assert(res === 1, "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!>!>", "annotation lost");
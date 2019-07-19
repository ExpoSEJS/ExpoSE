"use strict";
var S$ = require('S$');

var A = new (S$.SecAnn("A"))([]);
var res = S$.annotate(true, A);

S$.assert(res === true, "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!>!>", "annotation not added");
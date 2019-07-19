"use strict";
var S$ = require('S$');

var A = new (S$.SecAnn("A"))([]);
var res = S$.annotate({field : "val", field2: "val2"}, A);

//S$.assert(res === {field : "val", field2: "val2"}, "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!>!>", "annotation lost");
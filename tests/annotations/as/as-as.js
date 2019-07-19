"use strict";

var S$ = require('S$');

var A = new (S$.SecAnn("A"))([]);
var B = new (S$.SecAnn("B"))([]);

var res = S$.annotate(S$.annotate(true, A), B);

S$.assert(res === true, "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!> * B<!!>!>", "annotation not added");
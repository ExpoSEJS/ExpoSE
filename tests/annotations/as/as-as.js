"use strict";

var S$ = require('S$');

var A = S$.SecAnn("A");
var B = S$.SecAnn("B");

var res = S$.annotate(S$.annotate(true, A), B);

S$.assert(res === true, "value lost");
S$.assert(S$.annotations(res) === "Top<!A<!!> * B<!!>!>", "annotation not added");
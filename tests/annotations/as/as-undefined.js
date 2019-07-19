"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
var res = S$.annotate(undefined, A);

S$.assert(res === undefined, "value lost");
S$.assert(S$.annotations(res) === "No annotations", "annotation incorrectly added to null");
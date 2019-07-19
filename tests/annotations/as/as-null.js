"use strict";
var S$ = require('S$');

var A = new (S$.SecAnn("A"))([]);
var res = S$.annotate(null, A);

S$.assert(res === null, "value lost");
S$.assert(S$.annotations(res) === "No annotations", "annotation incorrectly added to null");
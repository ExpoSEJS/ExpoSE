"use strict";
var S$ = require('S$');

var A = S$.SecAnn("A");
var res = S$.annotate(function(x) { return x; }, A);

//S$.assert(''+res === ''+(function(x) { return x; }), "value lost");
S$.assert(S$.annotations(res) === "No annotations", "annotation incorrectly added to functions");
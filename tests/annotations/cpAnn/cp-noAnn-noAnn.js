"use strict";
var S$ = require('S$');

var A = new (S$.SecAnn("A"))([]);
var B = new (S$.SecAnn("B"))([]);

var a = true;
var b = false;
var res = S$.cpAnn(a, b);

S$.assert(res === false, "value lost");
S$.assert(S$.annotations(res) === "No Annotations", "annotation not copied");
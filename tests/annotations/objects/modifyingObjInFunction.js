"use strict";
var S$ = require('S$');
var A = new (S$.SecAnn("A"))([]);

var modArr = function(arr) {
	for (var i = 0; i < arr.length; i++) {
		arr[i] = 1;
	}
	console.log('hi')
	S$.annotate(arr, A);
	console.log('hi')
	return null;
};

var x = new Uint8Array(16);
modArr(x);
S$.assert(S$.annotations(x) === "Top<!A<!!>!>",
	      "Annotation lost due to creation of new wrapped value");
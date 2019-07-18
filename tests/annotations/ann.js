"use strict";

var S$ = require('S$');

console.log('A');
var A = S$.Annotations.Annotation.create('A', []);
console.log('B');
var B = S$.Annotations.Annotation.create('B', []);
console.log('C');
var C = S$.Annotations.Annotation.create('C', []);

var a = S$.annotate(true, new A([]));
console.log('HI');

a = S$.annotate(a, new C([]));
console.log('BYE');

console.log(S$.annotations(a));
console.log('' + a);

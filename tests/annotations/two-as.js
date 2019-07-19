"use strict";

var S$ = require('S$');

console.log('A');
var A = S$.Annotations.Annotation.create('A', []);
console.log('B');
var B = S$.Annotations.Annotation.create('B', []);
console.log('C');
var C = S$.Annotations.Annotation.create('C', []);

console.log('first annotate starting');
var a = S$.annotate(true, new A([]));
console.log('first annotate done');

console.log('second annotate starting');
a = S$.annotate(a, new C([]));
console.log('second annotate done');

console.log(S$.annotations(a));
console.log('' + a);

"use strict";

var S$ = require('S$');

function f(x, maxLen) {
    var s = x.match(/<([a-z]+)>(.*?)<\/\1>/);
    if (s) {
        if (s[2].length <= 0) {
            throw '*** Element Missing ***';
        } else if (s[2].length > maxLen) {
            throw '*** Element Too Long ***';
        } else {
            throw '*** Success ***';
        }
    } else {
        throw '*** Malformed XML ***';
    }
}

var len = S$.symbol("L", 3);
var str = S$.symbol("A", 'foo');

S$.assume(str.length < 10);

f(str, len);

"use strict";

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

var len = symbolic L initial 3;
var str = symbolic A initial 'foo';

assume str.length < 10;

f(str, len);

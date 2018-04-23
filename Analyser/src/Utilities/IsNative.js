/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

/** 
 * Some code is from https://gist.github.com/jdalton/5e34d890105aca44399f by John-David Dalton
 */
const toString = Object.prototype.toString;
const fnToString = Function.prototype.toString;
const reHostCtor = /^\[object .+?Constructor\]$/;
const SECRET_CACHE_STR = '__checked_isNative__before__';

var reNative = RegExp('^' +
    String(toString)
    .replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
    .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

function isNativeCore(value) {
    var type = typeof value;
    return type == 'function' ? reNative.test(fnToString.call(value)) :
        (value && type == 'object' && reHostCtor.test(toString.call(value))) || false;
}

function isNative(v) {
    const type = typeof v;
    if (type && (type == 'function' || type == 'object')) {

        if (v[SECRET_CACHE_STR]) {
            return v[SECRET_CACHE_STR]['isNative'];
        }

        let result = isNativeCore(v);
        
        try {
            v[SECRET_CACHE_STR] = { isNative: result };
        } catch (e) {
            //TODO: We can't cache this result because non-enumerable? report
        }        

        return result;
    } else {
        return false;
    }
}

export {isNative};

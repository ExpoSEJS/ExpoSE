"use strict";

import S$ from 'S$';
import Annotation from './Annotation';

var Taint = Annotation.create('Taint', ['name']);

Annotation.extend(Taint, 'getField', function (origin) {
    return function (base, fieldName, result) {
        return [false, S$.assume(result).is(S$.t(S$.Top, [this]))];
    };
});

Annotation.extend(Taint, 'setField', function (origin) {
    return function (base, fieldName, val) {
        return {
            discard: false,
            result: S$.assume(result).is(S$.t(S$.Top, [this]))
        };
    };
});

Annotation.extend(Taint, 'invokedOn', function (origin) {
    return function (f, base, args, result) {
        return {
            discard: false,
            result: S$.assume(result).is(S$.t(S$.Top, [this]))
        };
    };
});

Annotation.extend(Taint, 'binary', function (origin) {
    return function (left, right, op, iAmLeft, result) {
        return {
            discard: false,
            result: S$.assume(result).is(S$.t(S$.Top, [this]))
        };
    };
});

Annotation.extend(Taint, 'unary', function (origin) {
    return function (me, op, result) {
        return {
            discard: false,
            result: S$.assume(result).is(S$.t(S$.Top, [this]))
        };
    };
});

export default Taint;

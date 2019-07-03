"use strict";

import S$ from 'S$';
import Trait from './Trait';

var Taint = Trait.create('Taint', ['name']);

Trait.extend(Taint, 'getField', function (origin) {
    return function (base, fieldName, result) {
        return {
            discard: false,
            result: S$.assume(result).is(S$.t(S$.Top, [this]))
        };
    };
});

Trait.extend(Taint, 'setField', function (origin) {
    return function (base, fieldName, val) {
        return {
            discard: false,
            result: S$.assume(result).is(S$.t(S$.Top, [this]))
        };
    };
});

Trait.extend(Taint, 'invokedOn', function (origin) {
    return function (f, base, args, result) {
        return {
            discard: false,
            result: S$.assume(result).is(S$.t(S$.Top, [this]))
        };
    };
});

Trait.extend(Taint, 'binary', function (origin) {
    return function (left, right, op, iAmLeft, result) {
        return {
            discard: false,
            result: S$.assume(result).is(S$.t(S$.Top, [this]))
        };
    };
});

Trait.extend(Taint, 'unary', function (origin) {
    return function (me, op, result) {
        return {
            discard: false,
            result: S$.assume(result).is(S$.t(S$.Top, [this]))
        };
    };
});

export default Taint;
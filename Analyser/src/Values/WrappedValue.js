/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import ArrayHelper from '../Utilities/ArrayHelper';
 
/**
 * Wrapped (shadow-value) class by Blake Loring (c) 2015
 */
class WrappedValue {

    constructor(concrete) {
        this.concrete = concrete;
        this.rider = null;
    }

    getAnnotations() {
        return this.rider ? this.rider.params() : [];
    }

    discardAnnotation(annotation) {

        let index = this.getAnnotations().indexOf(annotation);

        if (index != -1) {
            this.getAnnotations().splice(index, 1);
            annotation.discarded(this.concrete);
        }

        return this;
    }

    _discardAnnotations(toRemove) {
        toRemove.forEach(annotation => this.discardAnnotation(annotation));
        return this;
    }

    _reduceAnnotations(fn) {
        return this.getAnnotations().reduce(
            (list, annotation) => ArrayHelper.addIf(fn(annotation), list, annotation), []
        );
    }

    reduceAndDiscard(fn) {
        this._discardAnnotations(this._reduceAnnotations(fn));
        return this;
    }

    clone() {
        return new WrappedValue(this.concrete);
    }

    toString() {
        return 'Wrapped(' + this.concrete + ', ' + (this.rider ? this.rider.toString() : '') + ')';
    }

    valueOf() {
        return this.concrete ? this.concrete.valueOf() : this.concrete;
    }
}

WrappedValue.isWrapped = function(val) {
    return val instanceof WrappedValue;
}

WrappedValue.clone = function(val) {
    return val instanceof WrappedValue ? val.clone() : val;
}

WrappedValue.getConcrete = function(val) {
    return WrappedValue.isWrapped(val) ? val.concrete : val;
}

WrappedValue.getAnnotations = function(val) {
    return WrappedValue.isWrapped(val) ? val.getAnnotations() : [];
}

/**
 * Reduce and discard annotations based on the predicate fn from the given value
 */
WrappedValue.reduceAndDiscard = (val, fn) => val instanceof WrappedValue && val.reduceAndDiscard(fn);

/**
 * If the passed value is already wrapped return value otherwise return a new wrapped version of the value
 */
WrappedValue.wrap = val => val instanceof WrappedValue ? val : new WrappedValue(val);

/*
 * Copyright 2013 Samsung Information Systems America, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Author: Koushik Sen
// ES6 Translation: Blake Loring

class ConcolicValue extends WrappedValue {
    
    constructor(concrete, symbolic) {
        super(concrete);
        this.symbolic = symbolic;
    }

    toString() {
        return 'Concolic(' + this.concrete + ', ' + this.symbolic +', ' + (this.rider ? this.rider.toString() : '') + ')';
    }

    clone() {
        return new ConcolicValue(this.concrete, this.symbolic);
    }
}

ConcolicValue.getSymbolic = (val) => val instanceof ConcolicValue ? val.symbolic : undefined;

export {WrappedValue, ConcolicValue};

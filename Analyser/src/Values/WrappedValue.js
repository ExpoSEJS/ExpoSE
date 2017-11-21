/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

class WrappedValue {

    constructor(concrete) {
        this.concrete = concrete;
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
// ES6 Translation / Prototype Chain: Blake Loring

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

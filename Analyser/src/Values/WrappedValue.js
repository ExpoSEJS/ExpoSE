/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */



/*
 * Original Concolic Value License
 *
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
// ES6 Translation / Blake Loring

class WrappedValue {
  constructor(concrete) {
    this.concrete = concrete;
    this.annotations = null;
  }

  getAnnotations() {
    if (this.annotations) {
      return this.annotations;
    } else {
      return [];
    }
  }

  getAnParams() {
    if (this.annotations) {
      return this.getAnnotations().params();
    } else {
      return [];
    }
  }

  discardAnnotation(annotation) {
    let index = this.getAnParams().indexOf(annotation);
    if (index != -1) {
        this.getAnParams().splice(index, 1);
    }
    return this;
  }

  _discardAnnotations(toRemove) {
    toRemove.forEach(annotation => this.discardAnnotation(annotation));
    return this;
  }

  _reduceAnnotations(fn) {
    return this.getAnParams().filter(annotation => fn(annotation));
  }

  reduceAndDiscard(fn) {
    this._discardAnnotations(this._reduceAnnotations(fn));
    return this;
  }

  clone() {
    return new WrappedValue(this.concrete);
  }

  toString() {
    return "Wrapped(" + this.concrete + ", " + (this.annotations ? this.annotations.toString() : "") + ")";
  }

  valueOf() {
    return this.concrete ? this.concrete.valueOf() : this.concrete;
  }

  getConcrete() {
    return this.concrete;
  }
}

class ConcolicValue extends WrappedValue {
  /**
   * TODO: I'm not sure I like passing array type with concolic values to sanity check comparisons
   */    
  constructor(concrete, symbolic, arrayType = undefined) {
    super(concrete);
    this.symbolic = symbolic;
    this._arrayType = arrayType;
  }

  toString() {
    return "Concolic(" + this.concrete + ", " + this.symbolic + ")";
  }

  clone() {
    return new ConcolicValue(this.concrete, this.symbolic);
  }

  getConcrete() {
    return this.concrete;
  }

  getSymbolic() {
    return this.symbolic;
  }

  getArrayType() {
    return this._arrayType;
  }
}

ConcolicValue.getSymbolic = function(val) {
  return val instanceof ConcolicValue ? val.symbolic : undefined;
};

ConcolicValue.setSymbolic = function(val, val_s) {
  if (val instanceof ConcolicValue) {
    val.symbolic = val_s;
  }
};

export {WrappedValue, ConcolicValue};

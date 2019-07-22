/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

/**
 * If this method is passed a single argument it wraps in a WrappedValue,
 * If this message is passed two arguments (name, concrete) it creates a new symbol
 */
var AssertToolkit = {};

var Annotations = require('Annotations');
AssertToolkit.Annotations = Annotations;
AssertToolkit.Top = Annotations.Top; 

/**
 * A bin of existing symbols
 */
AssertToolkit.existing = {};

/**
 * If a symbol name isn't unique (Has been used already) rename it with _n
 */
AssertToolkit.rename = function(name) {
    if (!AssertToolkit.existing[name]) {
        AssertToolkit.existing[name] = 1;
        return name;
    } else {
        AssertToolkit.existing[name]++;
        return name + '_' + AssertToolkit.existing[name];
    }
}

AssertToolkit.assume = function(val) {
    if (!val) {
        throw new AssertToolkit.NotAnErrorException();
    }
}

AssertToolkit.annotations = function(val) {
  if (Object._expose.getAnnotations(val)) {
    return Object._expose.getAnnotations(val).toString();
  } else {
    return "No Annotations";
  }
}

AssertToolkit.annotate = function(val, t) {
  var current = Object._expose.getAnnotations(val);
  t = new AssertToolkit.Top([t]);
  current = current ? current.generateAs(t) : t;
  return Object._expose.setAnnotations(val, current); 
}

AssertToolkit.drop = function(val, t) {
  var current = Object._expose.getAnnotations(val);
  t = new AssertToolkit.Top([t]);
  current = current ? current.generateDrop(t) : t;
  return Object._expose.setAnnotations(val, current);
}

/**
 * Create a new symbol with a given name and initial concrete value
 */
AssertToolkit.symbol = function(name, c) {
    if (typeof(c) !== 'undefined') {
        return Object._expose.makeSymbolic(AssertToolkit.rename(name), c);
    } else {
        return AssertToolkit.pureSymbol(name);
    }
}

AssertToolkit.pureSymbol = function(name) {
    return Object._expose.pureSymbol(AssertToolkit.rename(name));
}

/**
 * Expose the annotations to the tests
 */
AssertToolkit.NotAnErrorException = Object._expose.notAnError();

/**
 * Immediately fail the running script for a given reason
 */
AssertToolkit.fail = function(reason) {
    throw reason;
}

/**
 * If supplied a single argument the method runs _constructAssertion to generate an object with is, equals and doesntEqual methods
 * If supplied two arguments the method asserts that the first is truthy and if it isn't fails with reason desc
 */
AssertToolkit.assert = function(value, desc) {
    if (!value) {
        if (desc instanceof Function) {
            desc = desc();
        }
        AssertToolkit.fail(desc);
    }
}

/**
 * Constructs a new class of annotation.
 * Does not return an instance since that would not allow subtyping
 */
AssertToolkit.SecAnn = function (name, fromTrait) {
    return AssertToolkit.Annotations.Annotation.create(name, [], fromTrait);
}

/**
 * Copies annotations on val1 to val2
 */

AssertToolkit.cpAnn = function (val1, val2) {
  var ann1 = Object._expose.getAnnotations(val1);
  var ann2 = Object._expose.getAnnotations(val2);
  if (ann1 && ann1.length === 0) { ann1 = null; };
  if (ann2 && ann2.length === 0) { ann2 = null; };
  var t = new AssertToolkit.Top([]);
  ann1 = ann1 ? ann1 : t;
  ann2 = ann2 ? ann1.generateAs(ann2) : t.generateAs(ann1);
  return Object._expose.setAnnotations(val2, ann2); 
}

/**
 * Enforces the annotation supplied is a subtype of the annotation on val
 */
AssertToolkit.enforce = function (val, ann) {
  if (ann.toString() === "Top<!!>") {
    //do nothing - this always passes
  } else if (val === null || val === undefined || typeof val === "function") {
    //Always fails since the Enforcement is non-Top
    //Mirrors formalism semantics
    AssertToolkit.fail("FailedSecurityCheck");
  } else {
    //general case
    var valAnn = Object._expose.getAnnotations(val); 
    ann = new AssertToolkit.Top([ann]);
    valAnn = valAnn ? valAnn : new AssertToolkit.Top([]);
    AssertToolkit.assert(valAnn.isSubtypeOf(ann), "FailedSecurityCheck");
  }
}

module.exports = AssertToolkit;

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"no_prelude";
"use strict";

let Traits;

try {
    Traits = require('Traits');
} catch (e) {
    console.log('Traits not present');
}

function Replace(s, fr, to, w) {
    return s.substr(0, fr) + w + s.substr(to, s.length);
}

/*String.prototype.replace = function(regex, w) {
    console.log('TODO: Replace prototype is new and needs better modeling');
    let cString = this;
    let nm;
    let done = false;
    
    while ((nm = cString.match(regex)) && !done) {
        cString = Replace(cString, nm.index, nm.index + nm[0].length, w);
        if (regex.global) {
            done = true;
        }
    }

    return cString;
}*/

 /**
  * Interpretter hooks
  */
function __not__error_exp__() {}
function __clone__(v) {}
function __make__symbolic__(n, c) {}
function __wrap__(v) {}
function __get__rider__(v) {}
function __set__rider__(v, t) {}

var HIDDEN_WRAP_MARKER = '__hidden_wrapped__';

/**
 * If this method is passed a single argument it wraps in a WrappedValue,
 * If this message is passed two arguments (name, concrete) it creates a new symbol
 */
function AssertToolkit() {
    AssertToolkit.fail('Should not be invoked directly');
}

if (Traits) {
    AssertToolkit.Traits = Traits;
    AssertToolkit.Top = Traits.Trait.create('', []);
}

AssertToolkit.isPrimitive = function(val) {
 
    switch (typeof val) {
        case "undefined":
        case "number":
        case "boolean":
        case "string":
            return true;
    }

    if (val === null) {
        return true;
    }

    return false;
}

AssertToolkit.symbolsNameBin = {};

/**
 * Resolves a symbol name by the number of times in this execution that symbol has already existed
 */
AssertToolkit.resolveSymbolName = function(name) {
    var nextId = (AssertToolkit.symbolsNameBin[name] = AssertToolkit.symbolsNameBin[name] ? AssertToolkit.symbolsNameBin[name] + 1 : 1);
    if (nextId != 1) {
        return (name + nextId);
    } else {
        return name;
    }
}

/**
 * Create a new symbol with a given name and initial concrete value
 * TODO: Note: _ in name are disallowed due to name resolution and should be validated (In tropigate possibly rather than here)
 */
AssertToolkit.symbol = function(name, c) {
    return __make__symbolic__(AssertToolkit.resolveSymbolName(name), c);
}

/**
 * Creates a new 'pure' symbol with an unknown type (Enumerates all current theories to create sample values)
 */
AssertToolkit.pureSymbol = function(name) {
    var name_type = AssertToolkit.symbol(name + "_type", 0);
    switch (name_type) {
        case 0:
            //TODO: Symbolic Undef?
            return undefined;
        case 1:
            //TODO: Symbolic Null?
            return null;
        case 2:
            return AssertToolkit.symbol(name + '_int', 0);
        case 3:
            return AssertToolkit.symbol(name + '_string', 'PureString');
        default:
            return AssertToolkit.symbol(name + '_bool', false);
    }
}

/**
 * Wrap a value in a WrappedValue class
 */
AssertToolkit.wrap = function(value) {
    if (AssertToolkit.isPrimitive(value)) {
        return __wrap__(value);
    } else {
        value[HIDDEN_WRAP_MARKER] = __wrap__(true);
        return value;
    }
}

AssertToolkit.fresh_clone = function(value) {
    return __clone__(value);
}

AssertToolkit.clone = function(value) {
    var rider = __get__rider__(value);
    var clone = AssertToolkit.fresh_clone(value);
    __set__rider__(clone, rider);
    return clone;
}

/**
 * Expose the annotations to the tests
 */
AssertToolkit.NotAnErrorException = __not__error_exp__();
AssertToolkit.GeneralError = function(x) { return x; }

AssertToolkit.mk = function(c, args) {

    function F(args) {
        return c.apply(this, args);
    }

    F.prototype = c.prototype;

    return new F(args);
}

AssertToolkit.t = function(c, ...args) {
    return AssertToolkit.mk(c, args);
}

AssertToolkit.asRider = function(val, t) {
    var rider = __get__rider__(val);
    rider = rider ? rider.generateAs(t) : t;
    __set__rider__(val, rider);
}

AssertToolkit.dropRider = function(val, t) {
    var rider = __get__rider__(val);
    rider = rider ? rider.generateDrop(t) : t;
    __set__rider__(val, rider);
}

AssertToolkit.isRider = function(val, t) {
    var rider = __get__rider__(val);
    return rider ? rider.isSubtypeOf(t) : false;
}

AssertToolkit.getRider = function(val) {
    return __get__rider__(val);
}

/**
 * The program will only continue past this point if the boolean condition is true
 * Returns an object with is on it which can be used to annotate wrapped values
 */
AssertToolkit.assume = function(condition) {

    condition = AssertToolkit.wrap(condition);

    function ist(type) {
        AssertToolkit.asRider(AssertToolkit.getWrappedPortion(condition), type);
        return condition;
    }

    function dropt(type) {
        AssertToolkit.dropRider(AssertToolkit.getWrappedPortion(condition), type);
        return condition;
    }

    return {
        true: function() {
            if (!condition) {
                throw new AssertToolkit.NotAnErrorException();
            }
        },
        false: function() {
            if (condition) {
                throw new AssertToolkit.NotAnErrorException();
            }
        },
        is: ist,
        drop: dropt
    }
}

AssertToolkit.getWrappedPortion = function(val) {

    if (!AssertToolkit.isPrimitive(val) && val[HIDDEN_WRAP_MARKER]) {
        return val[HIDDEN_WRAP_MARKER];
    }

    return val;
}

/**
 * Immediately fail the running script for a given reason
 */
AssertToolkit.fail = function(reason) {
    throw AssertToolkit.GeneralError(reason);
}

AssertToolkit.test = function(val) {
    return {
        is: function(type) {
            return AssertToolkit.isRider(AssertToolkit.getWrappedPortion(val), type);
        }
    };
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

export default AssertToolkit;
module.exports = exports["default"];

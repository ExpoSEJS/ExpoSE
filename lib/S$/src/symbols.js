/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"no_prelude";
"use strict";

/**
 * TODO: Move these models elsewhere
 */

function hidden_replace(s, fr, to, w) {
    return s.substr(0, fr) + w + s.substr(to, s.length);
}

function secret_replace_once(str, regex, w) {
    let nm = regex.exec(str);

    if (nm) {
        let end_index = nm.index + nm[0].length;
        return [hidden_replace(str, nm.index, end_index, w), end_index];
    } else {
        return undefined;
    }
}

String.prototype.secret_replace = function (regex, w) {
    console.log('TODO: Replace prototype is new and needs better modeling ' + regex + ' and w ' + w);
		console.log('Regex ' + regex);
    
    regex = new RegExp(regex.source, regex.flags);

    let result = this;
    let next_start = 0;

    do {
        let next_split = result.substr(next_start, result.length);
        let replace_portion = secret_replace_once(next_split, regex, w);

        if (replace_portion === undefined) {
            break;
        }

        result = result.substr(0, next_start) + replace_portion[0];
        next_start += replace_portion[1];
    } while (regex.global);

    return result;
};

String.prototype.secret_split = function (regex) {
    console.log('TODO: Split prototype is new and needs better modeling ' + regex);

    regex = new RegExp(regex.source, regex.flags);
    
    let result = [];
    let remaining = this;

    do {

        let match = remaining.match(regex);

        if (!match) {
            break;
        }

        result.push(remaining.substr(0, match.index));
        remaining = remaining.substr(match.index + match[0].length, remaining.length);
    } while (true);

    if (remaining.length > 0) {
        result.push(remaining);
    }

    return result;
};

/**
 * If this method is passed a single argument it wraps in a WrappedValue,
 * If this message is passed two arguments (name, concrete) it creates a new symbol
 */
let AssertToolkit = {};

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

/**
 * Create a new symbol with a given name and initial concrete value
 * TODO: Note: _ in name are disallowed due to name resolution and should be validated (In tropigate possibly rather than here)
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

export default AssertToolkit;
module.exports = exports["default"];

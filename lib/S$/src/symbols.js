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
    console.log('TODO: Replace prototype is new and needs better modeling ' + regex);
    
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
    return Object._expose.makeSymbolic(AssertToolkit.rename(name), c);
}

/**
 * Symbolic arrays are currently implemented in terms of other arrays
 */
AssertToolkit.symbolicArray = function(name) {
    let arrayIndices = AssertToolkit.symbol(name + '_Element_Type_Array', [0]);
    let arrayNums = AssertToolkit.symbol(name + '_Num_Array', [0]);
    let arrayStrings = AssertToolkit.symbol(name + '_Strings_Array', [""]);
    let arrayBools = AssertToolkit.symbol(name + '_Bool_Array', [false]);

    AssertToolkit.assume((arrayIndices.length == arrayBools.length) && (arrayIndices.length === arrayNums.length) && (arrayIndices.length === arrayStrings.length));

    return new Proxy([], {
        get: function(target, idx) {

            if (idx === "length") {
                return arrayIndices.length;
            }

            idx = Number.parseInt(idx);

            if (arrayIndices.length <= idx) {
                return undefined;
            }

            switch (arrayIndices[idx]) {
                case undefined:
                case 0:
                    return undefined;
                case 1:
                    return null;
                case 2:
                    return arrayNums[idx];
                case 3:
                    return arrayBools[idx];
                case 4:
                    return arrayStrings[idx];
                case 5:
                    if (!target in idx) {
                        target[idx] = AssertToolkit.symbolicArray(name + '_sub_array');
                    }
                    return target[idx];
                default:
                    if (!target in idx) {
                        target[idx] = AssertToolkit.symbolicObject(name + '_sub_object');
                    }
                    return target[idx];
            }
        },
        set: function(target, idx, value) {
            
            if (value === undefined) {
                arrayIndices[idx] = 0;
            } else if (value === null) {
                arrayIndices[idx] = 1;
            } else if (typeof value === "number") {
                arrayIndices[idx] = 2;
                arrayNums[idx] = value;
            } else if (typeof value === "boolean") {
                arrayIndices[idx] = 3;
                arrayBools[idx] = value;
            } else if (typeof value === "string") {
                arrayIndices[idx] = 4;
                arrayStrings[idx] = value;
            } else if (value instanceof Array) {
                arrayIndices[idx] = 5;
                target[idx] = value;
            } else {
                arrayIndices[idx] = 6;
                target[idx] = value;
            }

            return true;
        }
    });
}

AssertToolkit.symbolicObject = function(name) {
    return new Proxy({}, {
        get: function(target, name) {
            if (!(name in target)) {
                target[name] = AssertToolkit.pureSymbol(name + '_Field');
            }
            return target[name];
        },
        set: function(target, name, value) {
            target[name] = value;
            return true;
        }
    });
}

/**
 * Creates a new 'pure' symbol with an unknown type (Enumerates all current theories to create sample values)
 */
AssertToolkit.pureSymbol = function(name) {
    let name_type = AssertToolkit.symbol(name + "_type", 0);

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
        case 4:
            return AssertToolkit.symbolicArray(name + '_array');
        case 5:
            return AssertToolkit.symbolicObject(name + '_Object');
        default:
            return AssertToolkit.symbol(name + '_bool', false);
    }
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

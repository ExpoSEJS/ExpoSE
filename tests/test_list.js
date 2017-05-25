/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

function buildTestList() {
    var testList = [];

    function buildTest(file, expectPaths, expectErrors) {
        testList.push({
            path: file,
            expectPaths: expectPaths,
            expectErrors: expectErrors
        });
    }

    //Core Javascript, no symbex / annotations
    buildTest('core/bools.js', 1, 0);
    buildTest('core/recursion.js', 1, 0);
    buildTest('core/lamda.js', 1, 0);

    //Booleans
    buildTest('bool/hello.js', 2, 0);
    buildTest('bool/basic.js', 4, 1);

    //Pure Symbols
    buildTest('pure/pure_symbol.js', 8, 0)

    //Integers
    buildTest('integers/hello.js', 2, 0);
    buildTest('integers/lt.js', 3, 0);
    buildTest('integers/coerce.js', 2, 0);
    buildTest('integers/mul.js', 2, 0);
    buildTest('integers/breaker.js', 1, 0);
    buildTest('integers/infoflow.js', 17, 0);

    //Fractions
    buildTest('fractions/fraction_one.js', 3, 0);

    buildTest('assert/assert.js', 6, 0);

    buildTest('assumes/basic.js', 2, 0);
    buildTest('assumes/wrapped_assume.js', 2, 0);

    //Loops
    buildTest('loops/loop_alot.js', 12, 0);

    //Named methods
    buildTest('named_method/simple.js', 1, 0);

    //Strings
    buildTest('strings/hello_strings.js', 2, 0);
    buildTest('strings/hello_strings2.js', 3, 0);
    buildTest('strings/hello_strings_concat.js', 2, 0);
    buildTest('strings/hello_strings_concat2.js', 1, 0);
    buildTest('strings/hello_strings_len.js', 2, 0);
    buildTest('strings/strings_concat.js', 2, 0);
    buildTest('strings/warning.js', 4, 0);

    //Regex
    buildTest('regex/anchors.js', 2, 0);

    buildTest('regex/test_three_deep.js', 7, 3);

    buildTest('regex/replace_and_length.js', 5, 0);
    buildTest('regex/replace_and_length.js', 3, 0);

    //Async
    buildTest('async/settimeout.js', 3, 1);

    return testList;
}

exports["default"] = buildTestList();
module.exports = exports["default"];

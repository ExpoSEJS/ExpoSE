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

    buildTest('regex/test/alternatives/simple.js', 4, 4);
    buildTest('regex/test/alternatives/many.js', 4, 4);
    buildTest('regex/test/alternatives/exhaustive_simple.js', 5, 5);

    buildTest('regex/test/atoms/simple_one.js', 2, 1);
    buildTest('regex/test/atoms/simple_two.js', 2, 1);


    buildTest('regex/test/star/star.js', 7, 7);
    buildTest('regex/test/star/star_online.js', 12, 11);
    buildTest('regex/test/star/lazy.js', 7, 7);

    buildTest('regex/test/plus/plus.js', 12, 11);
    buildTest('regex/test/plus/lazy.js', 12, 11);

    //buildTest('regex/test/anchors/left.js', 5, 5); //TODO: This has more tests than it should
    //buildTest('regex/test/anchors/none.js', 6, 6); //TODO: This has more tests than it should

    buildTest('regex/test/assertions/arbitrary_ahead.js', 3, 3);

    /*
    //Regex
    buildTest('regex/primatives/anchors_one.js', 3, 1);
    buildTest('regex/primatives/anchors_two.js', 5, 2);

    buildTest('regex/primatives/simple_one.js', 2, 0);
    buildTest('regex/primatives/simple_two.js', 2, 1);

    buildTest('regex/primatives/klene_plus_one.js', 3, 1);
    buildTest('regex/primatives/klene_plus_two.js', 3, 1);
    buildTest('regex/primatives/klene_plus_three.js', 2, 0);

    buildTest('regex/primatives/kleene_star_two.js', 3, 2);
    buildTest('regex/primatives/kleene_star_three.js', 2, 1);

    buildTest('regex/primatives/primative_rw_github.js', 2, 1);

    //buildTest('regex/test_three_deep.js', 7, 3);

    buildTest('regex/replace_and_length.js', 5, 0);
    buildTest('regex/replace_and_length.js', 3, 0);
    */

    //Async
    buildTest('async/settimeout.js', 3, 1);

    return testList;
}

exports["default"] = buildTestList();
module.exports = exports["default"];

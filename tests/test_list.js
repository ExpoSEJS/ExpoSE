/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

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

    //Async
    buildTest('async/settimeout.js', 3, 1);

    //Strings
    buildTest('strings/hello_strings.js', 2, 0);
    buildTest('strings/hello_strings2.js', 3, 0);
    buildTest('strings/hello_strings_concat.js', 2, 0);
    buildTest('strings/hello_strings_concat2.js', 1, 0);
    buildTest('strings/hello_strings_len.js', 2, 0);
    buildTest('strings/strings_concat.js', 2, 0);
    buildTest('strings/warning.js', 4, 0);

    /**
     * Regular Expression Feature Test
     */

    /**
     * Core language tests
     */
    buildTest('regex/core/alternation/simple.js', 4, 4);
    buildTest('regex/core/alternation/many.js', 4, 4);
    buildTest('regex/core/alternation/words.js', 4, 4);
    buildTest('regex/core/alternation/exhaustive_simple.js', 5, 5);
    buildTest('regex/core/alternation/multiple_related.js', 7, 7);

    buildTest('regex/core/literals/simple_one.js', 2, 1);
    buildTest('regex/core/literals/simple_two.js', 2, 1);
    buildTest('regex/core/literals/long_example.js', 2, 2);
    buildTest('regex/core/literals/empty_example.js', 2, 2);
    buildTest('regex/core/literals/mixed_escaped.js', 3, 3); //TODO: Should this be 2
    buildTest('regex/core/literals/non_alpha.js', 2, 2);
    buildTest('regex/core/literals/multiple.js', 6, 6);

    buildTest('regex/core/escaping/hex.js', 5, 4);
    buildTest('regex/core/escaping/unicode.js', 6, 5);
    buildTest('regex/core/escaping/unicode_mode.js', 6, 5);
    buildTest('regex/core/escaping/ranges.js', 8, 8);
    buildTest('regex/core/escaping/negative_ranges.js', 3, 2);
    buildTest('regex/core/escaping/space_class.js', 8, 7);
    buildTest('regex/core/escaping/word.js', 3, 2);
    buildTest('regex/core/escaping/digit.js', 3, 2);

    buildTest('regex/core/star/star.js', 7, 7);
    buildTest('regex/core/star/online.js', 11, 10);
    buildTest('regex/core/star/lazy.js', 7, 7);
    buildTest('regex/core/star/multiple.js', 5, 5);

    buildTest('regex/core/plus/plus.js', 12, 11);
    buildTest('regex/core/plus/lazy.js', 12, 11);
    buildTest('regex/core/plus/online.js', 11, 10);
    buildTest('regex/core/plus/multiple.js', 4, 4);

    buildTest('regex/core/loops/fixed_loop.js', 3, 2);
    buildTest('regex/core/loops/between_loop.js', 9, 8);
    buildTest('regex/core/loops/minimum_loop.js', 6, 5);

    buildTest('regex/core/optional/base.js', 13, 12);
    buildTest('regex/core/optional/combined.js', 9, 8);
    buildTest('regex/core/optional/no_greed.js', 13, 12);
    buildTest('regex/core/optional/range.js', 3, 2);

    /**
     * Lazy Operator Tests
     */

    buildTest('regex/lazy/lazy_1.js', 3, 2);
    buildTest('regex/lazy/lazy_2.js', 2, 1);
    buildTest('regex/lazy/lazy_3.js', 3, 2);
    buildTest('regex/lazy/lazy_4.js', 2, 1);
    buildTest('regex/lazy/lazy_5.js', 3, 2);
    buildTest('regex/lazy/lazy_6.js', 3, 2);

    /**
     * Anchors Tests
     */
    buildTest('regex/anchors/left.js', 3, 3);
    buildTest('regex/anchors/right.js', 3, 3); //TODO: An extra query is generated
    buildTest('regex/anchors/none.js', 4, 4);
    buildTest('regex/anchors/both.js', 2, 1);

    /**
     * Assertion Tests
     */
    buildTest('regex/test/assertions/arbitrary_ahead.js', 3, 3);

    /**
     * Backreference Tests
     */
    buildTest('regex/backreferences/closed.js', 2, 1);
    buildTest('regex/backreferences/closed_limited.js', 2, 1);
    buildTest('regex/backreferences/closed_range.js', 3, 2);
    buildTest('regex/backreferences/closed_limited.js', 3, 1); //Extra path from assume

    //These we can fail because of restrictions on S
    buildTest('regex/backreferences/closed_loop.js', 2, 1);
    buildTest('regex/backreferences/closed_loop_minor.js', 2, 1);
    buildTest('regex/backreferences/closed_loop_interleaved.js', 2, 1);
    buildTest('regex/backreferences/closed_loop_complex.js', 3, 2);
    buildTest('regex/backreferences/closed_loop_quantified.js', 4, 2); // We fail this test because of the restrictions in the paper

    //Start of open group tests, these will fail often due to restriction on S
    buildTest('regex/backreferences/open.js', 5, 4);
    buildTest('regex/backreferences/open_two.js', 4, 3);
    buildTest('regex/backreferences/open_three.js', 4, 3);
    buildTest('regex/backreferences/open_four.js', 3, 2);

    buildTest('regex/backreferences/open_unlocked.js', 4, 3);
    buildTest('regex/backreferences/open_unlocked_2.js', 4, 3);
    buildTest('regex/backreferences/open_unlocked_3.js', 5, 4);

    /**
     * End of backreference tests
     */

    buildTest('regex/captures/greedy2.js', 3, 2);
    buildTest('regex/captures/greedy_capture.js', 3, 2);
    buildTest('regex/captures/simple.js', 4, 3);
    buildTest('regex/captures/anchors.js', 4, 3);
    buildTest('regex/captures/related.js', 3, 2);
    buildTest('regex/captures/multiple_locked.js', 2, 1);

    buildTest('regex/exec/greed/anchors.js', 4, 3);
    buildTest('regex/exec/greed/nested.js', 4, 3);
    buildTest('regex/exec/greed/optionals.js', 3, 2);
    buildTest('regex/exec/greed/related.js', 3, 2);

    //buildTest('regex/match/non_sticky.js', 3, 0);

    /**
     * Replace application model tests
     */

     buildTest('regex/replace/single/single_replace.js', 5, 3);
     buildTest('regex/replace/single/replace_2.js', 3, 2);
     buildTest('regex/replace/single/replace_3.js', 4, 3);

     /**
      * Split application model tests
      */

     buildTest('regex/split/split_1', 8, 2);

    /**
     * Search application model tests
     */

    buildTest('regex/search/simple.js', 2, 2);
    buildTest('regex/search/ambiguous1.js', 3, 2);
    buildTest('regex/search/ambiguous2.js', 3, 1); //One extra path spawned by assume command
    buildTest('regex/search/ambiguous3.js', 3, 2); //One extra path spawned by assume command
    buildTest('regex/search/ambiguous4.js', 7, 3); //TODO: Weird results
    buildTest('regex/search/alt.js', 3, 3);
    buildTest('regex/search/not_at_start.js', 3, 3);
    buildTest('regex/search/test_at_start.js', 5, 4);

    /**
     * End of regular expression feature tests
     */

    return testList;
}

exports["default"] = buildTestList();
module.exports = exports["default"];

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
     * End of regular expression feature tests
     */

    return testList;
}

exports["default"] = buildTestList();
module.exports = exports["default"];

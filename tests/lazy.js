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
     * Lazy Operator Tests
     */

    buildTest('regex/lazy/lazy_1.js', 3, 2);
    buildTest('regex/lazy/lazy_2.js', 2, 1);
    buildTest('regex/lazy/lazy_3.js', 3, 2);
    buildTest('regex/lazy/lazy_4.js', 2, 1);
    buildTest('regex/lazy/lazy_5.js', 3, 2);
    buildTest('regex/lazy/lazy_6.js', 3, 2);

    return testList;
}

exports["default"] = buildTestList();
module.exports = exports["default"];

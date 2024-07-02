/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

function buildTestList() {
  var testList = [];

  function buildTest(file, expectPaths, expectErrors) {
    testList.push({
      path: file,
      expectPaths: expectPaths,
      expectErrors: expectErrors,
    });
  }

  /**
   * Core language tests
   */
  buildTest("regex/core/alternation/simple.js", 4, 4);
  buildTest("regex/core/alternation/many.js", 4, 4);
  buildTest("regex/core/alternation/words.js", 4, 4);
  buildTest("regex/core/alternation/exhaustive_simple.js", 5, 5);
  buildTest("regex/core/alternation/multiple_related.js", 7, 7);

  buildTest("regex/core/literals/simple_one.js", 2, 1);
  buildTest("regex/core/literals/simple_two.js", 2, 1);
  buildTest("regex/core/literals/long_example.js", 2, 2);
  buildTest("regex/core/literals/empty_example.js", 2, 2);
  buildTest("regex/core/literals/mixed_escaped.js", 3, 3); //TODO: Should this be 2
  buildTest("regex/core/literals/non_alpha.js", 2, 2);
  buildTest("regex/core/literals/multiple.js", 6, 6);

  buildTest("regex/core/escaping/hex.js", 5, 4);
  buildTest("regex/core/escaping/unicode.js", 6, 5);
  buildTest("regex/core/escaping/unicode_mode.js", 6, 5);
  buildTest("regex/core/escaping/ranges.js", 8, 8);
  buildTest("regex/core/escaping/negative_ranges.js", 3, 2);
  buildTest("regex/core/escaping/space_class.js", 8, 7);
  buildTest("regex/core/escaping/word.js", 3, 2);
  buildTest("regex/core/escaping/digit.js", 3, 2);

  buildTest("regex/core/star/star.js", 7, 7);
  buildTest("regex/core/star/online.js", 11, 10);
  buildTest("regex/core/star/lazy.js", 7, 7);
  buildTest("regex/core/star/multiple.js", 5, 5);

  buildTest("regex/core/plus/plus.js", 12, 11);
  buildTest("regex/core/plus/lazy.js", 12, 11);
  buildTest("regex/core/plus/online.js", 11, 10);
  buildTest("regex/core/plus/multiple.js", 4, 4);

  buildTest("regex/core/loops/fixed_loop.js", 3, 2);
  buildTest("regex/core/loops/between_loop.js", 9, 8);
  buildTest("regex/core/loops/minimum_loop.js", 6, 5);

  buildTest("regex/core/optional/base.js", 13, 12);
  buildTest("regex/core/optional/combined.js", 9, 8);
  buildTest("regex/core/optional/no_greed.js", 13, 12);
  buildTest("regex/core/optional/range.js", 3, 2);

  return testList;
}

exports["default"] = buildTestList();
module.exports = exports["default"];

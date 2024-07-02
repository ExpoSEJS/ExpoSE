/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

const LAST_IID = "LAST_IID";
const IS_TOUCHED = 0x1;
const CONDITIONAL_TRUE = 0x2;
const CONDITIONAL_FALSE = 0x4;

class Coverage {
  constructor() {
    this._current = {};
  }

  _getFile(file) {
    if (!this._current[file]) {
      this._current[file] = {
        smap: {},
        branches: {},
      };
    }
    return this._current[file];
  }

  _addSMap(f, smap) {
    f.smap = smap;
  }

  _mergeBranches(f, branches) {
    for (let i in branches) {
      f.branches[i] |= branches[i];
    }
  }

  _mergeLineNumbers(touched, all, smap, branches) {
    for (let idx in smap) {
      if (!isNaN(idx) && smap[idx] && smap[idx].line) {
        all.add(smap[idx].line);
      }
    }

    for (let idx in branches) {
      if (!isNaN(idx) && branches[idx] && smap[idx] && smap[idx].line) {
        touched.add(smap[idx].line);
      }
    }
  }

  /**
   * Merges new coverage data from a path with existing data
   */
  add(coverage) {
    for (let i in coverage) {
      if (i != LAST_IID) {
        let file = this._getFile(i);
        this._addSMap(file, coverage[i].smap);
        this._mergeBranches(file, coverage[i].branches);
      }
    }

    return this;
  }

  _termResults(file) {
    let found = 0;
    let total = 0;

    for (let i in file.smap) {
      total++;

      if (file.branches[i] & IS_TOUCHED) {
        found++;
      }
    }

    return {
      found: found,
      total: total,
      coverage: found / total,
    };
  }

  _locResults(file) {
    let touchedLines = new Set();
    let totalLines = new Set();

    for (let i in file.smap) {
      const lineNumber = file.smap[i][0];
      totalLines.add(lineNumber);
      if (file.branches[i] & IS_TOUCHED) {
        touchedLines.add(lineNumber);
      }
    }

    touchedLines = Array.from(touchedLines);
    totalLines = Array.from(totalLines);

    const highestLineNumber = totalLines.reduce(
      (last, next) => Math.max(last, next),
      0,
    );

    return {
      touched: touchedLines,
      all: totalLines,
      found: touchedLines.length,
      total: highestLineNumber,
      coverage: touchedLines.length / totalLines.length,
    };
  }

  _total(list, field) {
    let found = 0;
    let total = 0;

    for (let file of list) {
      found += file[field].found;
      total += file[field].total;
    }

    return total != 0 ? found / total : 0;
  }

  _decisionResults(file) {
    let conditionalIids = 0;
    let trueTaken = 0;
    let falseTaken = 0;

    for (let i in file.smap) {
      if (i % 4 == 0) {
        conditionalIids++;

        if (file.branches[i] & CONDITIONAL_TRUE) {
          trueTaken++;
        }

        if (file.branches[i] & CONDITIONAL_FALSE) {
          falseTaken++;
        }
      }
    }

    const totalPossibleDecisions = 2 * conditionalIids;

    return {
      trueTaken: trueTaken,
      falseTaken: falseTaken,
      totalOptions: totalPossibleDecisions,
      coverage: (trueTaken + falseTaken) / totalPossibleDecisions,
    };
  }

  final(includeSmap) {
    let results = [];

    for (let fileName in this._current) {
      let file = this._getFile(fileName);
      results.push({
        file: fileName,
        smap: includeSmap ? file.smap : undefined,
        branches: includeSmap ? file.branches : undefined,
        terms: this._termResults(file),
        loc: this._locResults(file),
        decisions: this._decisionResults(file),
      });
    }

    let [loc, terms] = [
      this._total(results, "loc"),
      this._total(results, "terms"),
    ];

    results.loc = loc;
    results.terms = terms;

    return results;
  }

  /**
   * Final without terms or lines
   * TODO: Doesn't really need to exist
   */
  current() {
    let results = this.final();

    results.forEach((item) => {
      delete item.loc.touched;
      delete item.loc.all;
    });

    return results;
  }

  lines() {
    return this.final().reduce((prev, next) => {
      prev[next.file] = {
        all: next.loc.all,
        touched: next.loc.touched,
      };
      return prev;
    }, {});
  }
}

export default Coverage;

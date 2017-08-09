/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

class Coverage {

    constructor() {
        this._current = {};
    }

	_getFile(file) {
		if (!this._current[file]) {
			this._current[file] = {
				smap: [],
				branches: [],
				touchedLines: new Set()
			};
		}
		return this._current[file];
	}

	_addSMap(f, smap) {
		f.smap = smap;
	}

	_mergeBranches(f, branches) {
		for (let i in branches) {
			f.branches[i] = 1;
		}
	}

    _mergeLineNumbers(file, lineNumbers) {
        lineNumbers.forEach(lineNumber => {
            file.touchedLines.add(lineNumber);
        });
    }

    /**
     * Merges new coverage data from a path with existing data
       */
    add(coverage) {
        for (let i in coverage) {
            let file = this._getFile(i);
            this._addSMap(file, coverage[i].smap);
            this._mergeBranches(file, coverage[i].branches);
            this._mergeLineNumbers(file, coverage[i].touchedLines);
        }
    }

	_results(file) {
		let found = 0;
		let total = 0;

		for (let i in file.smap) {
			total++;
			found = file.branches[i] ? found + 1 : found;
		}

		return {
			found: found,
			total: total,
			coverage: found / total
		}
	}

    final() {
        let results = [];

        for (let fidx in this._current) {
            let file = this._getFile(fidx);
            results.push({
                file: fidx,
                data: this._results(file),
                coveredLines: Array.from(file.touchedLines)
            });
        }

        return results;
    }

    getTouchedLines() {
        let toStringify = {};
        Object.keys(this._current).forEach( key => {
            let file = this._current[key];
            toStringify[key] = Array.from(file.touchedLines).sort((a, b) => a - b);
        });
        return JSON.stringify(toStringify);
    }
}

export default Coverage;

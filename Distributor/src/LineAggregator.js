/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

class LineCoverage {

	constructor() {
		this._linesCovered = {};
	}


    getInstrumentedLineNumbers(coverage) {
        let files = coverage._current;
        Object.keys(files).forEach( fileName => {
            let coveredLines = [];
            this._linesCovered[fileName] = coveredLines;
            files[fileName].branches.forEach((value, lineNumber) => {
                if (value === 1){
                    coveredLines.push(lineNumber);
                }
            }) 
        });
    }
}

export default LineCoverage;

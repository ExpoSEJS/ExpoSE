/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Config from './Config';

const lineNumberRegex = /\/\S*.js:[\d]*:[\d]*:([\d]*):([\d]*)/;

class Coverage {

    /**
     * Creates an instance of Coverage.
     * @param {any} sandbox The Jalangi sandbox
     * @param {any} returnTouchedLineNumbers If non-instrumented coverage numbers be returned 
     * _branches is an array of coverages for a given sid where the sid is branches[sid+1]
     * @memberOf Coverage
     */
    constructor(sandbox) {
        this._sandbox = sandbox;
        this._branches = [];
        this._branchFilenameMap = [];
    }

    end() {
        let ret = {};
        for (let i = 0; i < this._branches.length; i++) {
            if (this._branches[i] !== undefined) {
                //Deep copy the smap
            	let map = JSON.parse(JSON.stringify(this._sandbox.smap[i+1]));
                let touchedLines = [];
                //Strip away any non SID related entities
                //Also replace all source index arrays to a single value to reduce stdout
            	for (let j in map) {
            		if (isNaN(parseInt(j))) {
            			delete map[j];
            		} else {
                        map[j] = 1;

                        // Convert the sid and instrumented iid into an uninstrumented line number
                        if (Config.returnUninstrumentedLineCoverage){
                            let jalangiOutput = this._sandbox.iidToLocation(i + 1, j);
                            let uninstrumentedLineNumber = lineNumberRegex.exec(jalangiOutput);
                            if (uninstrumentedLineNumber.length >= 1){
                                touchedLines.push(uninstrumentedLineNumber[1]);
                            }
                        }
                    }
                }

                ret[this._branchFilenameMap[i]] = {
                	smap: map,
                    branches: this._branches[i],
                    touchedLines
                };
            }
        }

        return ret;
    }

    getBranchInfo() {
        let branchInfo = this._branches[this._sandbox.sid - 1];

        if (!branchInfo) {
            branchInfo = {};
            this._branches[this._sandbox.sid - 1] = branchInfo;
            this._branchFilenameMap[this._sandbox.sid - 1] = this._sandbox.smap[this._sandbox.sid].originalCodeFileName;
        }

        return branchInfo;
    }

    touch(iid) {
    	this.getBranchInfo()[iid] = 1;
    }

    _branchToLines(sid, branch){
        

        return this.sandbox.iidToLocation(sid, branch);
    }
}

export default Coverage;

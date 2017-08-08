/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

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
            
            //SID are indexed from 1 not 0
            const localSid = i + 1;

            if (this._branches[i] !== undefined) {
                //Deep copy the smap
                let touchedLines = [];
            	let map = JSON.parse(JSON.stringify(this._sandbox.smap[localSid]));

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

        //-1 from 1-indexed sid to start from 0
        const localIndex = this._sandbox.sid - 1;
        let branchInfo = this._branches[localIndex];

        if (!branchInfo) {
            branchInfo = {};
            this._branches[localIndex] = branchInfo;
            this._branchFilenameMap[localIndex] = this._sandbox.smap[this._sandbox.sid].originalCodeFileName;
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

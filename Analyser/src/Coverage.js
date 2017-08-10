/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import iidToLocation from './Utilities/iidToLocation';

class Coverage {

    /**
     * Creates an instance of Coverage.
     * @param {any} sandbox The Jalangi sandbox
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

                //TODO: This is a really ugly solution to working out whether it is possible to cover a given line
                //Find a way that doesn't involve transferring info on every line number out in the coverage file
                let touchedLines = [];
                let allLines = [];

                //Deep copy the smap
                let map = JSON.parse(JSON.stringify(this._sandbox.smap[localSid]));

                //Strip away any non SID related entities
                //Also replace all source index arrays to a single value to reduce stdout
                for (let j in map) {
                    if (isNaN(parseInt(j))) {
                        delete map[j];
                    } else {
                        map[j] = 1;
                        allLines.push(iidToLocation(this._sandbox, i + 1, j).uninstrumentedLineNumber);
                    }
                }

                for (let j in this._branches[i]) {
                    // Convert the sid and instrumented iid into an uninstrumented line number
                    touchedLines.push(iidToLocation(this._sandbox, i + 1, j).uninstrumentedLineNumber);
                }

                ret[this._branchFilenameMap[i]] = {
                    smap: map,
                    branches: this._branches[i],
                    
                    lines: {
                        all: allLines,
                        touched: touchedLines
                    }
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

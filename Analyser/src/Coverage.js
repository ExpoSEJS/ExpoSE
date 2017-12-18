/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import iidToLocation from './Utilities/iidToLocation';

const LAST_IID = 'LAST_IID';

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
        this._lastIid = 0; //Store the last IID touched for search strategizer
    }

    _pushLines(set, map, sid) {
        for (const nextIid in map) {
            if (!isNaN(parseInt(nextIid))) {
                const location = iidToLocation(this._sandbox, sid, nextIid);
                if (location) {
                    set.add(location.uninstrumentedLineNumber);
                }
            }
        }
    }

    end() {
        const payload = {};

        for (const i = 0; i < this._branches.length; i++) {
            
            //SID are indexed from 1 not 0
            const localSid = i + 1;

            if (this._branches[i] !== undefined) {

                //TODO: Return an Array[0,1,2] instead of 2 sets
                const touchedLines = new Set();
                const allLines = new Set();

                //Deep copy the smap
                const map = JSON.parse(JSON.stringify(this._sandbox.smap[localSid]));

                //Strip away any non SID related entities
                //Also replace all source index arrays to a single value to reduce stdout
                for (const localIid in map) {
                    if (isNaN(parseInt(localIid))) {
                        delete map[localIid];
                    } else {
                        map[localIid] = 1;
                    }
                }

                this._pushLines(allLines, map, localSid);
                this._pushLines(touchedLines, this._branches[i], localSid);

                payload[this._branchFilenameMap[i]] = {
                    smap: map,
                    branches: this._branches[i],
                    
                    lines: {
                        all: Array.from(allLines),
                        touched: Array.from(touchedLines)
                    }
                };
            }
        }

        payload[LAST_IID] = this._lastIid;

        return payload;
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
        this._lastIid = iid;
    }

    last() {
        return this._lastIid || 0;
    }

    _branchToLines(sid, branch){
        return this.sandbox.iidToLocation(sid, branch);
    }
}

export default Coverage;

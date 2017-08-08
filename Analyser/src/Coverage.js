/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

class Coverage {

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
            	let map = JSON.parse(JSON.stringify(this._sandbox.smap[localSid]));

                //Strip away any non SID related entities
                //Also replace all source index arrays to a single value to reduce stdout
            	for (let j in map) {
            		if (isNaN(parseInt(j))) {
            			delete map[j];
            		} else {
                        map[j] = 1;
                    }
            	}

                ret[this._branchFilenameMap[i]] = {
                	smap: map,
                    branches: this._branches[i]
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
}

export default Coverage;

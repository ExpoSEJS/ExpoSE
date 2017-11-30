/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

export default function(sandbox, sid, iid) {
    let ret;

    if ((ret = sandbox.smap[sid])) {
        const iidInfo = ret[iid];

        if (!iidInfo) {
            return null;
        }
        
        return {
            fileName: ret.originalCodeFileName,
            instrumentedLineNumber: iidInfo[0],
            instrumentedCharacterNumber: iidInfo[1],
            uninstrumentedLineNumber: iidInfo[2],
            uninstrumentedCharacterNumber: iidInfo[3]
        };
    }
}
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

export default function(sandbox, sid, iid) {
    let ret, arr;

    if ((ret = sandbox.smap[sid])) {
        var fileName = ret.originalCodeFileName;

        arr = ret[iid];

        if (arr) {
            return {
                fileName: fileName,
                instrumentedLineNumber: arr[0],
                instrumentedCharacterNumber: arr[1],
                uninstrumentedLineNumber: arr[2],
                uninstrumentedCharacterNumber: arr[3]
            };
        } else {
            console.log('Returning null on ' + sid + ' and ' + iid);
            return null;
        }
    }
}
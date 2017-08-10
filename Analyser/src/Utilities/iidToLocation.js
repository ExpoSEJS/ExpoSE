/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

export default function(sandbox, sid, iid) {
    let ret, arr;
    if (sandbox.smap) {
        if (typeof sid === 'string' && sid.indexOf(':')>=0) {
            sid = sid.split(':');
            iid = parseInt(sid[1]);
            sid = parseInt(sid[0]);
        }
        if ((ret = sandbox.smap[sid])) {
            var fileName = ret.originalCodeFileName;
            if (ret.evalSid !== undefined) {
                fileName = fileName+sandbox.iidToLocation(ret.evalSid, ret.evalIid);
            }
            arr = ret[iid];
            if (arr) {
                return {fileName: fileName,
                    instrumentedLineNumber: arr[0],
                    instrumentedCharacterNumber: arr[1],
                    uninstrumentedLineNumber: arr[2],
                    uninstrumentedCharacterNumber: arr[3]};
            } else {
                return null;
            }
        }
    }
}
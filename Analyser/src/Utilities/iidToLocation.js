/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

export default function(sandbox, sid, iid) {
    const iid_string = sandbox.iidToLocation(sid, iid);

    if (!iid_string) {
        return undefined;
    }

    const elems = iid_string.substr(1, iid_string.length - 2).split(':'); //Comes in the form (Filename:1:2:3:4)   
    
    return {
        line_start: elems[1],
        char_start: elems[2],
        line_end: elems[3],
        char_end: elems[4]
    };
}

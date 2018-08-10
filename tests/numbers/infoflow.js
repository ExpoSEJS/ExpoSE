/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var S$ = require('S$');

function flowTest(lo, hi) {

    console.log("Inputs: Hi:", hi, "Lo:", lo);

    var result = lo * 42;

    if (lo > 4) {
        console.log("Branch A-then");
        result -= lo;
    } else {
        console.log("Branch A-else");
        if (hi == 777) {
            result = -result;
        }
    }

    if (hi > 0) {
        console.log("Branch B-then");
    } else {
        console.log("Branch B-else");
    }

    console.log("Low output:", result);

    return result;
}

function verify(f) {

    var loInput = S$.symbol('LO', 0);
    var hiInput1 = S$.symbol('HI1', 10);
    var hiInput2 = S$.symbol('HI2', 10);

    var loOutput1 = f(loInput, hiInput1);
    var loOutput2 = f(loInput, hiInput2);

    if (hiInput1 !== 777 && hiInput2 !== 777) {
        S$.assert(loOutput1 === loOutput2);
    }
}

verify(flowTest);

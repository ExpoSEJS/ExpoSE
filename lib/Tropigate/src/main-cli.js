/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import main from './main';
import fs from 'fs';

function parseFile(filename, call) {
    fs.readFile(filename, function(err, data) {

        if (err) {
            throw err;
        }

        var src = data.toString();
        call(main(src));
    });
}

let fileName = process.argv[2];
parseFile(fileName, code => console.log(code));

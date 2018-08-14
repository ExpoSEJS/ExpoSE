/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import {spawn} from 'child_process';

const EXPOSE_TEST_SCRIPT = './expoSE';

class Tester {

    constructor(file) {
        this.file = file;
        this.out = "";
    }

    build(done) {

        let env = process.env;
        env.EXPOSE_EXPECTED_PC = this.file.expectPaths;

        let prc = spawn(EXPOSE_TEST_SCRIPT, [this.file.path], {
            env: env
        });

        prc.stdout.setEncoding('utf8');
        prc.stderr.setEncoding('utf8');
        prc.stdout.on('data', data => this.out += data.toString());
        prc.stderr.on('data', data => this.out += data.toString());

        const SECOND = 1000;
        const TIME_WARNING = 30;
        let longRunningMessage = setTimeout(() => console.log(`\rTEST WARNING: Test case ${this.file.path} is taking an excessive amount of time to complete (over ${TIME_WARNING}s)`), TIME_WARNING * SECOND);

        prc.on('close', code => {
            clearTimeout(longRunningMessage);
            done(code)
        });
    }
}

export default Tester;

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

const spawn = require('child_process').spawn;

const EXPOSE_PATH = 'expoSE';

//TODO: Executor should use summary.jobs[n].replay to build replay for consistency
//Otherwise 1 change becomes 2
function Executor(filepath, input, data, done) {

	let env = process.env;
	env.EXPOSE_JSON_OUT = 1;

    let args;

    if (input) {
        args = ['replay', filepath, input];
    } else {
        args = ['test', filepath];
    }

	let prc = spawn(EXPOSE_PATH, args, {
        stdio: ['ignore', 'pipe', 'pipe'],
    	env: env,
        disconnected: false
    });

    prc.final = '';
    prc.running = true;

    function record(d) {
    	this.final += d;
    	data(d);
    }

    prc.stdout.on('data', function(d) {
        this.final += d;
        data(d);
    }.bind(prc));
    prc.stderr.on('data', data);

    prc.stdout.on('close', function(c) {
    	this.running = false;
    	done(c);
    }.bind(prc));

    return prc;
}

module.exports = Executor;

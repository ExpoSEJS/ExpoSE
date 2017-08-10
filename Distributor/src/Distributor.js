/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Center from './Center';
import microtime from 'microtime';
import FileTransformer from './FileTransformer';

let os = require('os');

process.title = 'ExpoSE Distributor';

process.on('disconnect', function() {
    Log.log('Premature termination - Parent exit');
    process.exit();
});

function getTarget() {
    return process.argv[process.argv.length - 1];
}

function argToType(arg, type) {
    if (type == 'number') {
        return parseInt(arg);
    }
    return arg;
}

function getArgument(name, type, dResult) {
    return process.env[name] ? argToType(process.env[name], type) : dResult;
}

if (process.argv.length >= 3) {
    let target = getTarget();

    let numCpuCores = os.cpus().length;
    let defaultTestCases = numCpuCores;

    if (!getArgument('EXPOSE_MAX_CONCURRENT', 'number', undefined)) {
        console.log(`Number of CPU cores: ${numCpuCores}`);
        console.log(`Defaulting to ${defaultTestCases} concurrent test cases`);
    }

    let options = {
        maxConcurrent: getArgument('EXPOSE_MAX_CONCURRENT', 'number', defaultTestCases), //max number of tests to run concurrently
        maxPaths: getArgument('EXPOSE_MAX_PATHS', 'number', 100), //Max paths spawned
        jsonOut: getArgument('EXPOSE_JSON_OUT', 'number', false), //By default ExpoSE should not print JSON results into STDOUT
        printPaths: getArgument('EXPOSE_PRINT_PATHS', 'number', false), //By default do not print paths to stdout
        testMaxTime: getArgument('EXPOSE_TEST_TIMEOUT', 'number', 1000 * 60 * 15), //10 minutes default time
        printDeltaCoverage: getArgument('EXPOSE_PRINT_COVERAGE', 'number', false),
        analyseScript: getArgument('EXPOSE_PLAY_SCRIPT', 'string', './scripts/play')
    };

    console.log('ExpoSE Master: ' + target + ' max concurrent: ' + options.maxConcurrent + ' max paths: ' + options.maxPaths);

    let start = microtime.now();

    new Center(options).done((center, done, errors, coverage) => {

        if (options.jsonOut) {
            console.log('\nExpoSE JSON: ' + JSON.stringify({
                source: getTarget(),
                start: start,
                end: microtime.now(),
                done: done
            }) + '\nEND JSON');
        }

        function round(num, precision) { 
            return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
        }

        function formatSeconds(v) {
            return round((v / 1000 / 1000), 4);
        }

        done.forEach(item => {
            let testStartSeconds = item.startTime - start;
            console.log('*-- Test Case ' + JSON.stringify(item.input) + ' start ' + formatSeconds(testStartSeconds) + ' took ' + formatSeconds(item.time) + 's');

            if (item.errors.length != 0) {
                console.log('*-- Errors occured in test ' + JSON.stringify(item.input));
                item.errors.forEach(error => console.log('* Error: ' + error.error));
                console.log('*-- Replay with ' + item.replay);
            }
        });

        console.log('*-- Coverage Data');

        coverage.final().forEach(d => {
            console.log('*- File ' + d.file + '. Coverage: ' + Math.round(d.data.coverage * 100) + '%');
        });

        if (options.printDeltaCoverage) {
            let touched = coverage.getTouched();

            for (let filename in touched) {
                FileTransformer(filename).then(data => {
                    console.log(`*- Experimental Line Coverage for ${filename} *-`);
                    let lines = data.split('\n');
                    lines.map((line, idx) => touched[filename].find(i => i == idx + 1) ? ('+' + line) : ('-' + line)).forEach((line, idx) => console.log(`{idx+1}: ${line}`));
                });
            }
        }

        console.log('** ExpoSE Finished. ' + done.length + ' paths with ' + errors + ' errors **');
        process.exitCode = errors;
    }).start(target);
} else {
    console.log('Wrong number of arguments');
    console.log('Usage Distributor --concurrent XX --max_paths 999 test_script');
}

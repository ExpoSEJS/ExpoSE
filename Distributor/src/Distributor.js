/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
"use strict";

import Center from './Center';
import microtime from 'microtime';
import FileTransformer from './FileTransformer';

const fs = require('fs');
const os = require('os');

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

function maxConcurrent() {
    const defaultCpuCores = os.cpus().length;
    const fromArgOrDefault = getArgument('EXPOSE_MAX_CONCURRENT', 'number', defaultCpuCores);

    console.log(`Number of CPU cores: ${defaultCpuCores}`);
    console.log(`Max concurrent: ${fromArgOrDefault} concurrent test cases`);

    return fromArgOrDefault;
}

function timeFrom(envArg, defaultVal) {
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;

    function timeToMS(timeString) {
        const suffix = timeString[timeString.length - 1];

        if (suffix === 's') {
            return SECOND * Number.parseInt(timeString.slice(0, -1)); 
        } else if (suffix === 'm') {
            return MINUTE * Number.parseInt(timeString.slice(0, -1));
        } else if (suffix === 'h') {
            return HOUR * Number.parseInt(timeString.slice(0, -1));
        } else {
            return Number.parseInt(timeString);
        }
    }

    return timeToMS(getArgument(envArg, 'string', defaultVal));
}

function generateCoverageMap(lineInfo) {
    for (const filename in lineInfo) {
        FileTransformer(filename).then(data => {
            console.log(`*- Experimental Line Coverage for ${filename} `);
            const lines = data.split('\n');
            const linesWithNumbers = lines.map((line, idx) => `${idx + 1}:${line}`);

            const linesWithTouched = lines.map((line, idx) => {
                const lineNumber = idx + 1;
                if (!lineInfo[filename].all.find(i => i == lineNumber)) {
                    return `s${line}`;
                } else if (lineInfo[filename].touched.find(i => i == lineNumber)) {
                    return `+${line}`;
                } else {
                    return `-${line}`;
                }
            });

            linesWithTouched.forEach(line => console.log(line));
        });
    }
}

if (process.argv.length >= 3) {
    const target = getTarget();

    const options = {
        maxConcurrent: maxConcurrent(), //max number of tests to run concurrently
        maxTime: timeFrom('EXPOSE_MAX_TIME', '2h'),
        testMaxTime: timeFrom('EXPOSE_TEST_TIMEOUT', '20m'),
        jsonOut: getArgument('EXPOSE_JSON_PATH', 'string', undefined), //By default ExpoSE does not generate JSON out
        printPaths: getArgument('EXPOSE_PRINT_PATHS', 'number', false), //By default do not print paths to stdout
        printDeltaCoverage: getArgument('EXPOSE_PRINT_COVERAGE', 'number', false),
        analyseScript: getArgument('EXPOSE_PLAY_SCRIPT', 'string', './scripts/play')
    };

    console.log('ExpoSE Master: ' + target + ' max concurrent: ' + options.maxConcurrent);

    const start = microtime.now();
    const center = new Center(options);

    process.on('SIGINT', function() {
        center.cancel();
    });

    console.log('Setting timeout to ' + options.maxTime + 'ms');

    const maxTimeout = setTimeout(function() {
        center.cancel();
    }, options.maxTime);

    center.done((center, done, errors, coverage, stats) => {

        if (options.jsonOut !== undefined) {
            console.log(`\n*-- Writing JSON to ${options.jsonOut} --*`);
            fs.writeFileSync(options.jsonOut, JSON.stringify({
                source: getTarget(),
                start: start,
                end: microtime.now(),
                done: done
            }));
        }

        console.log('\n*-- Stat Module Output --*')

        for (const stat in stats) {
            console.log('*-- ' + stat + ': ' + JSON.stringify(stats[stat].payload));
        }

        console.log('*-- Stat Module Done --*')

        function round(num, precision) {
            return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
        }

        function formatSeconds(v) {
            return round((v / 1000 / 1000), 4);
        }

        done.forEach(item => {
            const testStartSeconds = item.startTime - start;
            console.log('*-- Test Case ' + JSON.stringify(item.input) + ' start ' + formatSeconds(testStartSeconds) + ' took ' + formatSeconds(item.time) + 's');

            if (item.errors.length != 0) {
                console.log('*-- Errors occured in test ' + JSON.stringify(item.input));
                item.errors.forEach(error => console.log('* Error: ' + error.error));
                console.log('*-- Replay with ' + item.replay);
            }
        });

        console.log('*-- Coverage Data');

        coverage.final().forEach(d => {
            console.log(`*- File ${d.file}. Coverage (Term): ${Math.round(d.terms.coverage * 100)}% Coverage (LOC): ${Math.round(d.loc.coverage * 100)}%`);
        });

        if (options.printDeltaCoverage) {
            generateCoverageMap(coverage.lines());
        } else {
            console.log('*- Re-run with EXPOSE_PRINT_COVERAGE=1 to print line by line coverage information');
        }

        console.log('** ExpoSE Finished. ' + done.length + ' paths with ' + errors + ' errors **');
        process.exitCode = errors;
        clearTimeout(maxTimeout);
    }).start(target);
} else {
    console.log(`USAGE: ${process.argv[0]} ${process.argv[1]} target`);
}

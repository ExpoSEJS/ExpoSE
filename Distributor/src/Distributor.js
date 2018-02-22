/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
"use strict";

import Center from './Center';
import Config from './Config';
import CoverageMap from './CoverageMap';

const fs = require('fs');

process.title = 'ExpoSE Distributor';

process.on('disconnect', function() {
    Log.log('Premature termination - Parent exit');
    process.exit();
});

function getTarget() {
    return process.argv[process.argv.length - 1];
}

if (process.argv.length >= 3) {
    const target = getTarget();

    console.log('ExpoSE Master: ' + target + ' max concurrent: ' + Config.maxConcurrent);

    const start = (new Date()).getTime();
    const center = new Center(Config);

    process.on('SIGINT', function() {
        center.cancel();
    });

    console.log('Setting timeout to ' + Config.maxTime + 'ms');

    const maxTimeout = setTimeout(function() {
        center.cancel();
    }, Config.maxTime);

    center.done((center, done, errors, coverage, stats) => {

        if (Config.jsonOut !== undefined) {
            console.log(`\n*-- Writing JSON to ${Config.jsonOut} --*`);
            fs.writeFileSync(Config.jsonOut, JSON.stringify({
                source: getTarget(),
                finalCoverage: coverage.final(true) /* Include SMAP in the final coverage JSON */,
                start: start,
                end: (new Date()).getTime(),
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
            console.log(`*- File ${d.file}. Coverage (Term): ${Math.round(d.terms.coverage * 100)}% Coverage (Decisions): ${Math.round(d.decisions.coverage * 100)}% Coverage (LOC): ${Math.round(d.loc.coverage * 100)}%`);
        });

        if (Config.printDeltaCoverage) {
            CoverageMap(coverage.lines(), line => console.log(line));
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

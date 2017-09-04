/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Spawn from './Spawn';
import Strategy from './Strategy';
import Coverage from './CoverageAggregator';

class Center {

    constructor(options) {
        this.cbs = [];
        this.options = options;
        this._strategy = null;
    }

    start(file) {

        this._lastid = 0;
        this._done = [];
        this._errors = 0;
        this._running = 0;
        this._coverage = new Coverage();

        this._startTesting([{
            id: this._nextID(),
            path: file,
            input: { _bound: 0 }
        }]);

        return this;
    }

    done(cb) {
        this.cbs.push(cb);
        return this;
    }

    _startTesting(files) {
        this._strategy = new Strategy();
        files.forEach(i => this._strategy.add(i));

        this._requeue();
        this._printStatus();
    }

    /**
     * If there is a slot & under max paths start an additional test
     */
    _startNext() {
        if (this._strategy.length()) {
            //TODO: Have different strategies, or
            //maybe different strategies running concurrently
            this._testFile(this._strategy.next());
        }
    }

    /**
     * True if another test can be queued
     */
    _canQueue() {
        return (this._done.length + this._running) < this.options.maxPaths && this._running < this.options.maxConcurrent;
    }

    /**
     * Queue as many tests as possible
     */
    _requeue() {
        while (this._strategy.length() && this._canQueue()) {
            this._startNext();
        }
    }

    _postTest() {
        this._running--;

        //Start any remaining queued
        this._requeue();
        this._printStatus();

        //If finished print output
        if (this._running === 0) {
            this._finishedTesting();
        }
    }

    _printStatus() {
        process.stdout.write('\r*** [' + this._done.length + ' done /' + this._strategy.length() +' queued / ' + this._running + ' running / ' + this._errors + ' errors / ' + this._coverage.current().loc.toFixed(2) * 100 + '% coverage ] ***');
    }

    _finishedTesting() {
        this.cbs.forEach(cb => cb(this, this._done, this._errors, this._coverage));
    }

    _nextID() {
        return this._lastid++;
    }

    _expandAlternatives(file, alternatives, testCoverage) {
        alternatives.forEach(alt => {
            this._strategy.add({
                id: this._nextID(),
                path: file.path,
                input: alt.input,
                pc: alt.pc
            }, alt, testCoverage);
        });
    }

    _pushDone(test, input, pc, alternatives, errors) {

        this._done.push({
            id: test.file.id,
            input: input,
            pc: pc,
            errors: errors,
            time: test.time(),
            startTime: test.startTime(),
            coverage: this._coverage.current(),
            replay: test.makeReplayString(),
            alternatives: alternatives.length
        });

        if (errors.length) {
            this._errors += 1;
        }
    }

    _testFileDone(code, test, finalOut, coverage, fsErrors) {

        let errors = fsErrors;

        if (code != 0) {
            errors.push({error: 'Exit code non-zero'});
        }

        if (coverage) {
            this._coverage.add(coverage);
        }

        if (finalOut) {
            this._pushDone(test, finalOut.input, finalOut.pc, finalOut.alternatives, errors.concat(finalOut.errors));
            this._expandAlternatives(test.file, finalOut.alternatives, coverage);
        } else {
            this._pushDone(test, test.file.input, test.file.pc, [], errors.concat([{ error: 'Error extracting final output - a fatal error must have occured' }]));
        }

        this._postTest();
    }

    _testFile(file) {
        this._running++;

        new Spawn(this.options.analyseScript, file, {
            log: this.options.printPaths,
            outFile: this.options.outFile,
            timeout: this.options.testMaxTime,
            coverageFile: this.options.coverageFile
        }).start(this._testFileDone.bind(this));
        
        this._printStatus();
    }
}

export default Center;

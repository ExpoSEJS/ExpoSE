/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Spawn from './Spawn';
import Strategy from './Strategy';
import Coverage from './CoverageAggregator';
import Stats from 'Stats';
import Log from './Log';

class Center {

    constructor(options) {
        this.cbs = [];
        this._cancelled = false;
        this.options = options;
    }

    start(file) {

        this._lastid = 0;
        this._done = [];
        this._errors = 0;
        this._running = [];
        this._coverage = new Coverage();
        this._stats = new Stats();

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

    _startTesting(cases) {
        this._strategy = new Strategy();
        cases.forEach(i => this._strategy.add(i));

        this._requeue();
        this._printStatus();
    }

    /**
     * If there is a slot & under max paths start an additional test
     */
    _startNext() {
        if (this._strategy.length()) {
            this._testFile(this._strategy.next());
        }
    }

    /**
     * True if another test can begin
     */
    _canStart() {
        return !this._cancelled && this._running.length < this.options.maxConcurrent;
    }

    /**
     * Queue as many tests as possible
     */
    _requeue() {
        while (this._strategy.length() && this._canStart()) {
            this._startNext();
        }
    }

    _remove(test) {
        const idx = this._running.indexOf(test);
        if (idx != -1) {
            this._running.splice(idx, 1);
        }
    }

    _postTest(test) {
        this._remove(test);

        //Start any remaining queued
        this._requeue();
        this._printStatus();

        //If finished print output
        if (!this._running.length) {
            this._finishedTesting();
        }
    }

    _printStatus() {
        Log('*** [' + this._done.length + ' done /' + this._strategy.length() +' queued / ' + this._running.length + ' running / ' + this._errors + ' errors / ' + this._coverage.current().loc.toFixed(2) * 100 + '% coverage ] ***');
    }

    _finishedTesting() {
        this.cbs.forEach(cb => cb(this, this._done, this._errors, this._coverage, this._stats.final()));
    }

    cancel() {
        this._cancelled = true;
        this._running.forEach(test => test.kill());
        this._finishedTesting();
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

    _pushDone(test, input, pc, alternatives, coverage, errors) {
        this._done.push({
            id: test.file.id,
            input: input,
            pc: pc,
            errors: errors,
            time: test.time(),
            startTime: test.startTime(),
            coverage: this._coverage.current(),
            case_coverage: this.options.perCaseCoverage ?  new Coverage().add(coverage).final(true) : undefined, 
            replay: test.makeReplayString(),
            alternatives: alternatives.length
        });

        if (errors.length) {
            this._errors += 1;
        }
    }

    _testFileDone(spawn, code, test, finalOut, coverage, fsErrors) {

        let errors = fsErrors;

        if (code != 0) {
            errors.push({error: 'Exit code non-zero'});
        }

        if (coverage) {
            this._coverage.add(coverage);
        }

        if (finalOut) {
            this._pushDone(test, finalOut.input, finalOut.pc, finalOut.alternatives, coverage, errors.concat(finalOut.errors));
            this._expandAlternatives(test.file, finalOut.alternatives, coverage);
            this._stats.merge(finalOut.stats);
        } else {
            this._pushDone(test, test.file.input, test.file.pc, [], coverage, errors.concat([{ error: 'Error extracting final output - a fatal error must have occured' }]));
        }

        this._postTest(test);
    }

    _testFile(file) {

        let nextTest = new Spawn(this.options.analyseScript, file, {
            log: this.options.printPaths,
            timeout: this.options.testMaxTime,
        });

        this._running.push(nextTest.start(this._testFileDone.bind(this)));
        this._printStatus();
    }
}

export default Center;

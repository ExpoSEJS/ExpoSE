/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */



import Tester from "./Tester";
import Walker from "./Walker";

class Runner {

	constructor(maxConcurrent) {
		this.cbs = [];
		this._maxConcurrent = maxConcurrent;
	}

	start(dir, fn) {
		this._errors = 0;
		this._running = 0;
		this._times = [];
		this.walker = new Walker(dir, fn).done(files => this.startTesting(files)).start();
		return this;
	}

	done(cb) {
		this.cbs.push(cb);
		return this;
	}

	startTesting(files) {
		this.files = files;
		this.filesTotal = files.length;
		this.done = 0;

		this._printStatus();

		//Start the tests
		for (let i = 0; i < this._maxConcurrent; i++) {
			this.startNext();
		}
	}

	/**
     * Start any remaining tests
     */
	startNext() {
		if (this.files.length) {
			this.testFile(this.files.pop());
		}
	}

	postTest() {

		this._running--;

		//Start any remaining queued
		this.startNext();
		this._printStatus();

		//If finished print output
		if (this._running === 0) {
			this.finishedTesting();
		}
	}

	_printStatus() {
		process.stdout.write("\r*** [" + this.done + "/" + this.filesTotal +"] [" + this._running + " running] [" + this._errors + " errors] ***");
	}

	finishedTesting() {
		console.log("\n**************************");
		console.log("*         Summary        *");
		console.log("**************************");
		console.log("*        " + this.done + " complete     *");
		console.log("*        " + this._errors + " errors        *");
		console.log("**************************");

		this._times.forEach((time) => {
			console.log(`* ${time}`);
		});

		this.cbs.forEach(cb => cb(this._errors));
	}

	_testFileDone(test, code, time, file) {
		this.done++;

		if (code !== file.expectErrors) {
			process.stderr.write("\n" + file.path + " failed with errors (" + code + "). Printing output\n");
			process.stderr.write(test.out + "\n");
			this._errors++;
		}

		this._times.push(`${file.path} took ${time / 1000}s`);

		this.postTest();
	}

	testFile(file) {
		this._running++;
		let test = new Tester(file);
		this._printStatus();
		test.build((code, time) => this._testFileDone(test, code, time, file));
	}
}

export default Runner;

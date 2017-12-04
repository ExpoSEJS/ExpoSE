/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

const output = require('./output');
const timer = require('./timer');
const summary = require('./summary');
const view = require('./view');
const remote = require('electron').remote;
const {dialog} = remote.require('electron');
const Executor = remote.require('../src/expose_executor');

let exec = null;

function running() {
	return (exec && exec.running);
}

function kill() {
	exec.kill('SIGINT');
	exec.stdin && exec.stdin.end();
	exec.stdout && exec.stdout.end();
	exec.stderr && exec.stderr.end();
}

function runExpoSE(page) {

	if (running()) {
		console.log('Already Running Something');
		return;
	}

	let file = dialog.showOpenDialog({properties: ['openFile'], filters: [{name: 'JavaScript File', extensions: ['js']}]});

	if (file) {
		console.log('Preparing to  execute ' + file);
		view.clear(page);
		view.running(true, page);
		summary(null, page);
		timer.start(page);
		exec = Executor(file, null, function(data) {
			view.out('' + data, page);
		}, function(err, jsonOut) {
			view.running(false, page);
			timer.stop(page);
			output.handleOutput(err, exec.final, jsonOut, page);
		});
	}
}

module.exports = {
	runExpoSE: runExpoSE,
	kill: kill,
	running: running
}

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

const remote = require('electron').remote;
const {dialog} = remote.require('electron');
const fs = remote.require('fs');
const Parser = remote.require('../src/output_parser');
const Replay = remote.require('../src/replay');
const graph = require('./graph');
const view = require('./view');

let current_output_src;
let current_summary;

function handleOutput(src) {

	current_output_src = src;

	view.clear();

	//Clear and add all lines of output to out
	src.split('\n').forEach(x=> {
		view.out('' + x);
	});

	let done = Parser(src);

	current_summary = done;

    if (!done) {
    	view.error('Error', 'No JSON');
    	view.result('Error No JSON');
    } else {
        summary(done);

        function replay(input) {
        	Replay(done.source, JSON.stringify(input));
        }

        done.jobs.forEach(x => {
            view.testcase(JSON.stringify(x.input), (x.time / 1000 / 1000), x.alternatives.length, x.errors.length, replay.bind(this, x.input));
        });

        done.jobs.forEach(x => {
            x.errors.forEach(r => {
            	view.error(JSON.stringify(x.input), '' + r.error, replay.bind(this, x.input));
            });
        });

        done.coverage.forEach(x => {
        	view.result(x.file, x.data.found, x.data.total, x.percentage);
        });

        graph(done);
    }
}

function loadOutput() {
	let file = dialog.showOpenDialog({properties: ['openFile']});

	if (!file) {
		console.log('No file selected');
		return;
	}

	let data = fs.readFileSync('' + file);

	if (!data) {
		console.log('No Data');
		return;
	}

	handleOutput('' + data);
}

function saveOutput() {
	
	if (!current_output_src) {
		console.log('There is no output');
		return;
	}

	let file = dialog.showSaveDialog({properties: ['saveFile']});

	if (!file) {
		return;
	}

	fs.writeFileSync(file, '' + current_output_src);
}

module.exports = {
	saveOutput: saveOutput,
	loadOutput: loadOutput,
	handleOutput: handleOutput,
	current: function() { return current_summary; }
}

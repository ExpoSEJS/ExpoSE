/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

function view(page) {
	$('#execute_pane').hide();
	$('#analyze_pane').hide();
	$('#output_pane').hide();
	$('#testcases_pane').hide();
	$('#errors_pane').hide();
	$('#' + page + '_pane').show();
}

function clearViews() {
	let output_v = $('#output_body');
	let results_v = $('#results_body');
	let errors_v = $('#errors_body');
	let testcases_v = $('#testcases_body');
	let graph_content = $('#graph_content');
	output_v.html('');
	results_v.html('');
	errors_v.html('');
	testcases_v.html('');
	graph_content.html('');
}

function addOut(v) {
	let output = $('#output_body');

	v.split('\n').forEach( x => {
		let content = x.trim();
		if (content.length) {
			output.append($('<tr><td>' + content + '</tr></td>'));
		}
	});
}

function buildReplayIcon(rp) {
	return rp ? '<span class="icon icon-play"></span>' : '';
}

function round(v, dp) {
	return Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp);
}

function addTestcase(input, time, alternatives, errorcount, replayHdlr) {
	let testcases_v = $('#testcases_body');

	let newElement = $('<tr><td>' + buildReplayIcon(replayHdlr) + '</td><td>' + input +'</td><td>' + round(time, 2) + 's</td><td>' + alternatives + '</td><td>' + errorcount + '</td></tr>');

	newElement.on('click', replayHdlr);

	testcases_v.append(newElement);;
}

function addError(input, msg, replayHdlr) {
	let errors_v = $('#errors_body');
	let elem = $('<tr><td>' + buildReplayIcon(replayHdlr) + '</td><td>' + input + '</td><td>' + msg + '</td></tr>');
	elem.on('click', replayHdlr);
	errors_v.append(elem);
}

function addResult(file, found, total, pc) {
	let results = $('#results_body');
	let elem = $('<tr><td>' + file + "</td><td>" + pc + "</td><td>" + found + '</td><td>' + total + '</td></tr>');
	results.append(elem);
}

function setRunning(v) {
	let run = $('#runbtn').hide();
	let cancel = $('#cancelbtn').hide();
	let load = $('#loadbtn').hide();
	
	if (v) {
		cancel.show();
	} else {
		run.show();
		load.show();
	}
}

function time(v) {
	let timer = $('#timer');
	if (v) {
		timer.html('Runtime: ' + v + 's');
	} else {
		timer.html('');
	}
}

module.exports = {
	load: view,
	result: addResult,
	error: addError,
	out: addOut,
	testcase: addTestcase,
	running: setRunning,
	clear: clearViews,
	time: time
}

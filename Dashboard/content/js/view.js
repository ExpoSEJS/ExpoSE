/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";


const summary = require('./summary');

function clearViews(page) {
	page['#output_body'].innerHTML = '';
	page['#results_body'].innerHTML = '';
	page['#errors_body'].innerHTML = '';
	page['#testcases_body'].innerHTML = '';
	page['#graph_content'].innerHTML = '';
}

function addOut(v, page) {
	page['#output_body'].innerHTML += v.split('\n').map(x => x.trim() + '<br/>').filter(x => x.length).join();
}

function buildReplayIcon(rp) {
	return rp ? '<x-icon name="play-arrow"></x-icon>' : '';
}

function round(v, dp) {
	return Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp);
}

function addTestcase(input, time, alternatives, errorcount, replayHdlr, page) {
	let testcases_v = page['#testcases_body'];

	let newTR = document.createElement('tr');
	newTR.innerHTML = '<td><a>' + buildReplayIcon(replayHdlr) + input +'</a></td><td>' + round(time, 2) + 's</td><td>' + alternatives + '</td><td>' + errorcount + '</td>';
	newTR.onclick = replayHdlr;

	testcases_v.appendChild(newTR);
}

function wrapSpan(txt) {
	return '<span style="display: inline;">' + txt + '</span>';
}

function addError(input, msg, replayHdlr, page) {
	let errors_v = page['#errors_body'];

	let newTR = document.createElement('tr');
	newTR.innerHTML = '<td><a>' + buildReplayIcon(replayHdlr) + input +'</a></td><td>' + msg + '</td>';
	newTR.onclick = replayHdlr;

	errors_v.appendChild(newTR);
}

function addResult(file, found, total, pc, page) {
	let results = page['#results_body'];
	results.innerHTML += '<tr><td>' + file + "</td><td>" + pc + "</td><td>" + found + '</td><td>' + total + '</td></tr>';
}

function setRunning(v, page) {
	let all_buttons = [page['#cancelbtn'], page['#runbtn'], page['#loadbtn']];

	all_buttons.forEach(x => page.hide(x));

	if (v) {
		page.show(all_buttons[0]);
	} else {
		page.show(all_buttons[1]);
		page.show(all_buttons[2]);
	}
}

function time(v, page) {
	let timer = page['#timer'];
	
	if (v) {
		page.show(timer);
	} else {
		page.hide(timer);
	}

	//Refresh the total exec count
	summary({info: {
		totalExec: v
	}}, page);
}

module.exports = {
	result: addResult,
	error: addError,
	out: addOut,
	testcase: addTestcase,
	running: setRunning,
	clear: clearViews,
	time: time
}

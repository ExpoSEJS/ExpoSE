/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

function clearViews(page) {
	page['#output_body'].innerHTML = '';
	page['#results_body'].innerHTML = '';
	page['#errors_body'].innerHTML = '';
	page['#testcases_body'].innerHTML = '';
	page['#graph_content'].innerHTML = '';
}

function addOut(v, page) {
	let output = page['#output_body'];

	v.split('\n').forEach( x => {
		let content = x.trim();
		if (content.length) {
			output.innerHTML += '<tr><td>' + wrapSpan(content) + '</tr></td>';
		}
	});
}

function buildReplayIcon(rp) {
	return rp ? '<x-icon name="play-arrow"></x-icon>' : '';
}

function round(v, dp) {
	return Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp);
}

function addTestcase(input, time, errorcount, replayHdlr, page) {
	let testcases_v = page['#testcases_body'];

	let newTR = document.createElement('tr');
	newTR.innerHTML = '<td><a>' + buildReplayIcon(replayHdlr) + input +'</a></td><td>' + round(time, 2) + 's</td><td>' + errorcount + '</td>';
	newTR.onclick = replayHdlr;

	testcases_v.appendChild(newTR);

	debugger;

	console.log('Added Handler');

	/*newElement.on('click', replayHdlr);
	testcases_v.append(newElement);*/
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
	if (v) {
		page.show(page['#cancelbtn']);
		page.hide(page['#runbtn']);
		page.hide(page['#loadbtn']);
	} else {
		page.show(page['#runbtn']);
		page.show(page['#loadbtn']);
		page.hide(page['#cancelbtn']);
	}
}

function time(v, page) {
	let timer = page['#timer'];
	if (v) {
		timer.innerHTML = 'Runtime: ' + v + 's';
	} else {
		timer.innerHTML = '';
	}
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

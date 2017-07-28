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
			output.innerHTML += '<tr><td>' + content + '</tr></td>';
		}
	});
}

function buildReplayIcon(rp) {
	return rp ? '<span class="icon icon-play"></span>' : '';
}

function round(v, dp) {
	return Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp);
}

function addTestcase(input, time, errorcount, replayHdlr, page) {
	let testcases_v = page['#testcases_body'];

	console.log('TODO: Replay broken');
	testcases_v.innerHTML += '<tr><td>' + input +'</td><td>' + round(time, 2) + 's</td><td>' + errorcount + '</td></tr>';

	/*newElement.on('click', replayHdlr);
	testcases_v.append(newElement);*/
}

function addError(input, msg, replayHdlr, page) {
	let errors_v = page['#errors_body'];
	errors_v.innerHTML += '<tr><td>' + input + '</td><td>' + msg + '</td></tr>';
	/*let elem = $('<tr><td>' + buildReplayIcon(replayHdlr) + '</td><td>' + input + '</td><td>' + msg + '</td></tr>');
	elem.on('click', replayHdlr);
	errors_v.append(elem);*/
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

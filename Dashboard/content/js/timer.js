/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

const view = require('./view');

let interval;
let start;

function startClock(page) {
	start = new Date().getTime();
	interval = setInterval(function() {
		let now = new Date().getTime();
		view.time(((now - start) / 1000).toFixed(2), page);
	}, 100);
}

function stopClock(page) {
	clearInterval(interval);
	view.time(null, page);
}

module.exports = {
	start: startClock,
	stop: stopClock
}

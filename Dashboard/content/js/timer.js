/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

const view = require('./view');

let interval;
let start;

function startClock() {
	start = new Date().getTime();
	interval = setInterval(function() {
		let now = new Date().getTime();
		view.time(((now - start) / 1000).toFixed(2));
	}, 100);
}

function stopClock() {
	clearInterval(interval);
	view.time(null);
}

module.exports = {
	start: startClock,
	stop: stopClock
}

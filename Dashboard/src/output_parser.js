/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

let expose = require('./expose');

module.exports = function(data) {
	let match = expose.OUT_REGEX.exec(data);
	if (match) {
		let summary = JSON.parse(match[1]);
		
		summary.done.forEach(x => {
			expose.coverage(x);
		});

		expose.sort(summary);

		return {
			source: summary.source,
			info: expose.summaryInfo(summary),
			jobs: summary.done,
			coverage: summary.done[summary.done.length - 1].coverage
		};
	}
}

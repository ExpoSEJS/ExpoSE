/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

module.exports = function(data, page) {
	let summary = page['#summary_body'];
	let inf;

	summary.innerHTML = '';

	if (data) {
		inf = data.info;
	} else {
		inf = {
			pathCount: '',
			totalExec: '',
			meanTest: '',
			medianTest: '',
			worstCase: '',
			bestCase: ''
		}
	}

	summary.innerHTML += '<tr><td>Total Paths</td><td>' + inf.pathCount + '</td>';
	summary.innerHTML += '<tr><td>Total Runtime</td><td>' + inf.totalExec + '</td>';
	summary.innerHTML += '<tr><td>Average Test (Mean)</td><td>' + inf.meanTest + '</td>';
	summary.innerHTML += '<tr><td>Average Test (Median)</td><td>' + inf.medianTest + '</td>';
	summary.innerHTML += '<tr><td>Best Case</td><td>' + inf.worstCase + '</td>';
	summary.innerHTML += '<tr><td>Worst Case</td><td>' + inf.bestCase + '</td>';
}

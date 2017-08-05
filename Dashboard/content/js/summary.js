/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

function updateBody(page, inf) {
	page['#total_path_count'].innerHTML = inf.pathCount;
	page['#total_runtime'].innerHTML = inf.totalExec;
	page['#average_test_mean'].innerHTML = inf.meanTest;
	page['#average_test_median'].innerHTML = inf.medianTest;
	page['#best_case_test'].innerHTML = inf.bestCase;
	page['#word_case_test'].innerHTML = inf.worstCase;
}

module.exports = function(data, page) {
	let summary = page['#summary_body'];

	let inf = {};

	if (data) {
		inf = data.info;
	}

	inf.pathCount = inf.pathCount || '';
	inf.totalExec = inf.totalExec || '';
	inf.meanTest = inf.meanTest || '';
	inf.medianTest = inf.medianTest || '';
	inf.worstCase = inf.worstCase || '';
	inf.bestCase = inf.bestCase || '';

	updateBody(page, inf);
}

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

function toPercentage(aggregate) {
	return (aggregate * 100).toFixed(2);
}

function toSeconds(v) {
	return (v / 1000 / 1000).toFixed(2) + 's';
}

function averageList(list) {
	return list.reduce((last, cur) => last + cur.time, 0) / list.length;
}

function coverage(job) {
	job.coverage.forEach(x => {
		x.percentage = {
			terms: toPercentage(x.terms.coverage),
			lines: toPercentage(x.loc.coverage)
		}
	});
}

function internal(filename) {
	return  filename.indexOf('/Annotations/') != -1 || filename.indexOf('/S$/') != -1 || filename.indexOf('/ExpoSE/lib/') != -1;
}

function aggregateCoverage(job) {
	let coveredBlocks = 0;
	let totalBlocks = 0;

	let coveredLines = 0;
	let totalLines = 0;
	
	job.coverage.forEach(x => {
		if (!internal(x.file)) {
			coveredBlocks += x.terms.found;
			totalBlocks += x.terms.total;
			coveredLines += x.loc.found;
			totalLines += x.loc.total;
		}
	});

	return {
		terms: toPercentage(coveredBlocks / totalBlocks),
		lines: toPercentage(coveredLines / totalLines)
	}
}

function sort(summary) {
	summary.done.forEach(x => {
		x.endTime = x.startTime + x.time;
	});

	summary.done.sort((left, right) => left.endTime - right.endTime);
}

function min(list) {
	return list.reduce((last, cur) => cur.time < last ? cur.time : last, list[0].time);	
}

function max(list) {
	return list.reduce((last, cur) => cur.time > last ? cur.time : last, 0);	
}

function summaryInfo(summary) {
	let jobList = summary.done;
	let midPoint = jobList[Math.floor(jobList.length / 2)];

	return {
		pathCount: jobList.length,
		totalExec: toSeconds(summary.end - summary.start),
		meanTest: toSeconds(averageList(jobList)),
		medianTest: toSeconds(midPoint.time),
		worstCase: toSeconds(min(jobList)),
		bestCase: toSeconds(max(jobList))
	}
}

function buildErrors(summary) {
	return summary.done.reduce((x, y) => x.concat(y.errors), []);
}

module.exports = {
	sort: sort,
	buildErrors,
	coverage: coverage,
	aggregateCoverage: aggregateCoverage,
	summaryInfo: summaryInfo,
	OUT_REGEX: /ExpoSE JSON: ([\s\S]*)\nEND JSON/
}

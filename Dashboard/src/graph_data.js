/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

const fs = require('fs');
const expose = require('./expose');
const TIMESTEP = 1000 * 1000;

function toSeconds(v) {
	return v / 1000 / 1000;
}

function timeutil(start, x) {
	return toSeconds(x - start.startTime);
}

function averageList(list) {
	return list.reduce((last, cur) => last + cur.time, 0) / list.length;
}

function handlePercentage(summary, outFile) {
	let jobList = summary.jobs;

	let time = timeutil.bind(this, jobList[0]);

	let coverageLines = "0, 0\n";

	let lastCoverage = 0;

	jobList.forEach((x, i) => {
		coverageLines += '' + time(x.endTime) + ', ' + Math.max(expose.aggregateCoverage(x), lastCoverage) + '\n';
		lastCoverage = expose.aggregateCoverage(x);
	});

	fs.writeFileSync(outFile, coverageLines);
}

function handlePerSecond(summary, outFile) {
	let jobList = summary.jobs;
	let startTime = jobList[0].startTime;
	let endTime = jobList[jobList.length - 1].endTime;
	let time = timeutil.bind(this, jobList[0]);
	let intervalLines = "0, 0\n";

	for (let i = startTime; i < endTime; i += TIMESTEP) {
		let jobsInInterval = jobList.filter(x => x.endTime >= i && x.endTime <= (i + TIMESTEP)).length;
		intervalLines += '' + time(i) + ', ' + jobsInInterval + '\n';
	}

	fs.writeFileSync(outFile, intervalLines);
}

function buildGraphData(summary, pcOutFile, rateOutFile) {
	handlePercentage(summary, pcOutFile);
	handlePerSecond(summary, rateOutFile);

	return {
		coverage: pcOutFile,
		rate: rateOutFile
	}
}

module.exports = buildGraphData;

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */



const fs = require("fs");
const tmp = require("tmp");
const graph_sorter = require("./graph_sorter");
const TIMESTEP = 1000 * 1000;

function toSeconds(v) {
    return v / 1000 / 1000;
}

function timeutil(start, x) {
    return toSeconds(x - start.startTime);
}

function handlePercentage(summary, outFile, mode, doneCb) {
    let jobList = summary.jobs;

    let time = timeutil.bind(this, jobList[0]);

    let coverageLines = "0, 0\n";

    let lastCoverage = 0;

    jobList.forEach(x => {
        coverageLines += "" + time(x.endTime) + ", " + Math.max(graph_sorter.aggregateCoverage(x)[mode], lastCoverage) + "\n";
        lastCoverage = graph_sorter.aggregateCoverage(x)[mode];
    });

    fs.writeFile(outFile, coverageLines, doneCb);
}

function handlePerSecond(summary, outFile, doneCb) {
    let jobList = summary.jobs;
    let startTime = jobList[0].startTime;
    let endTime = jobList[jobList.length - 1].endTime;
    let time = timeutil.bind(this, jobList[0]);
    let intervalLines = "0, 0\n";

    for (let i = startTime; i < endTime; i += TIMESTEP) {
        let jobsInInterval = jobList.filter(x => x.endTime >= i && x.endTime <= (i + TIMESTEP)).length;
        intervalLines += "" + time(i) + ", " + jobsInInterval + "\n";
    }

    fs.writeFile(outFile, intervalLines, doneCb);
}

function buildGraphData(summary, done) {

    const COVERAGE_MODES = ["lines", "terms"];

    let coverageFiles = COVERAGE_MODES.map(() => tmp.fileSync());
    let rateOutFile = tmp.fileSync();

    let finished = 0;

    function finishedCallback() {
        finished++;

        if (finished == coverageFiles.length + 1) {
            done({
                coverage: coverageFiles,
                rate: rateOutFile
            });
        }
    }

    COVERAGE_MODES.forEach((mode, idx) => handlePercentage(summary, coverageFiles[idx].name, mode, finishedCallback));
    handlePerSecond(summary, rateOutFile.name, finishedCallback);
}

module.exports = buildGraphData;

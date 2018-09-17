/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */



function toPercentage(aggregate) {
    return (aggregate * 100).toFixed(2);
}

function internal(filename) {
    return  filename.indexOf("/S$/") != -1 || filename.indexOf("/ExpoSE/lib/") != -1;
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
    };
}

module.exports = {
    aggregateCoverage: aggregateCoverage
};

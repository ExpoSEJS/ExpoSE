const fs = require('fs');

export default function(file, target, coverage, start, end, test_list, config) {
    console.log(`\n*-- Writing JSON to ${file} --*`);
    fs.writeFile(file, JSON.stringify({
        source: target,
        finalCoverage: coverage.final(true) /* Include SMAP in the final coverage JSON */ ,
        start: start,
        end: end,
        done: test_list
    }), err => { if (err) console.log(`Failed to write JSON because ${err}`) });
}
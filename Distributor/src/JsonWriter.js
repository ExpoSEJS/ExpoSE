/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

const fs = require("fs");

export default function(file, target, coverage, start, end, test_list) {
	console.log(`\n*-- Writing JSON to ${file} --*`);
	fs.writeFile(file, JSON.stringify({
		source: target,
		finalCoverage: coverage.final(true) /* Include SMAP in the final coverage JSON */ ,
		start: start,
		end: end,
		done: test_list
	}), err => { if (err) console.log(`Failed to write JSON because ${err}`); });
}

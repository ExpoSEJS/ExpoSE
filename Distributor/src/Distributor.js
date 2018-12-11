/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

import Internal from "./Internal";
import Center from "./Center";
import Config from "./Config";
import CoverageMap from "./CoverageMap";
import JsonWriter from "./JsonWriter";

process.title = "ExpoSE Distributor";

process.on("disconnect", function() {
	console.log("Premature termination - Parent exit");
	process.exit();
});

if (process.argv.length >= 3) {
	const target = process.argv[process.argv.length - 1];

	console.log("ExpoSE Master: " + target + " max concurrent: " + Config.maxConcurrent);

	const start = (new Date()).getTime();
	const center = new Center(Config);

	process.on("SIGINT", function() {
		center.cancel();
	});

	console.log("Setting timeout to " + Config.maxTime + "ms");
	console.log("Setting test timeouts to " + Config.testMaxTime + "ms");

	const maxTimeout = setTimeout(function() {
		center.cancel();
	}, Config.maxTime);

	center.done((center, done, errors, coverage, stats) => {

		if (Config.jsonOut) {
			JsonWriter(Config.jsonOut, target, coverage, start, (new Date()).getTime(), done);
		}

		console.log("\n*-- Stat Module Output --*");

		for (const stat in stats) {
			console.log("*-- " + stat + ": " + JSON.stringify(stats[stat].payload));
		}

		console.log("*-- Stat Module Done --*");

		function round(num, precision) {
			return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
		}

		function formatSeconds(v) {
			return round((v / 1000 / 1000), 4);
		}

		done.forEach(item => {
			const testStartSeconds = item.startTime - start;

			const pcPart = Config.printPathCondition ? ("PC: " + item.pc) : "";

			console.log("*-- Test Case " + JSON.stringify(item.input) + pcPart + " start " + formatSeconds(testStartSeconds) + " took " + formatSeconds(item.time) + "s");

			if (item.errors.length != 0) {
				console.log("*-- Errors occured in test " + JSON.stringify(item.input));
				item.errors.forEach(error => console.log("* Error: " + error.error));
				console.log("*-- Replay with " + item.replay);
			}
		});

		console.log("*-- Coverage Data");

		let totalLines = 0;

		coverage.final().forEach(d => {

			if (Internal(d.file)) {
				return;
			}

			console.log(`*- File ${d.file}. Coverage (Term): ${Math.round(d.terms.coverage * 100)}% Coverage (Decisions): ${Math.round(d.decisions.coverage * 100)}% Coverage (LOC): ${Math.round(d.loc.coverage * 100)}% Lines Of Code: ${d.loc.all.length} -*`);
			totalLines += d.loc.all.length;
		});

		console.log(`*-- Total Lines Of Code ${totalLines}`);

		if (Config.printDeltaCoverage) {
			CoverageMap(coverage.lines(), line => console.log(line));
		} else {
			console.log("*- Re-run with EXPOSE_PRINT_COVERAGE=1 to print line by line coverage information");
		}

		console.log("** ExpoSE Finished. " + done.length + " paths with " + errors + " errors **");

		process.exitCode = errors;
		clearTimeout(maxTimeout);
	}).start(target);
} else {
	console.log(`USAGE: ${process.argv[0]} ${process.argv[1]} target`);
}

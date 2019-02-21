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
 
	let target = process.argv[process.argv.length - 1];
	let initialInput = undefined;

	if (process.argv.length == 4) {
		target = process.argv[process.argv.length - 2];
		initialInput = JSON.parse(process.argv[process.argv.length - 1]);
	}

	console.log(`[+] ExpoSE ${target} concurrent: ${Config.maxConcurrent} timeout: ${Config.maxTime} per-test: ${Config.testMaxTime}`);

	const start = (new Date()).getTime();
	const center = new Center(Config);

	process.on("SIGINT", function() {
		center.cancel();
	});

	const maxTimeout = setTimeout(function() {
		center.cancel();
	}, Config.maxTime);

	center.done((center, done, errors, coverage, stats) => {

		if (Config.jsonOut) {
			JsonWriter(Config.jsonOut, target, coverage, start, (new Date()).getTime(), done);
		}

		function round(num, precision) {
			return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
		}

		function formatSeconds(v) {
			return round((v / 1000 / 1000), 4);
		}

		console.log("");

		done.forEach(item => {
			const pcPart = Config.printPathCondition ? (` PC: ${item.pc}`) : "";
			console.log(`[+] ${JSON.stringify(item.input)}${pcPart} took ${formatSeconds(item.time)}s`);
			item.errors.forEach(error => console.log(`[!] ${error.error}`));
			if (item.errors.length != 0) {
				console.log(`[!] ${item.replay}`);
			}
		});

		console.log("[!] Stats");

		for (const stat in stats) {
			console.log(`[+] ${stat}: ${JSON.stringify(stats[stat].payload)}`);
		}

		console.log("[!] Done");

		let totalLines = 0;
		let totalRealLines = 0;
		let totalLinesFound = 0;

		coverage.final().forEach(d => {

			if (Internal(d.file)) {
				return;
			}
			console.log(`[+] ${d.file}. Coverage (Term): ${Math.round(d.terms.coverage * 100)}% Coverage (Decisions): ${Math.round(d.decisions.coverage * 100)}% Coverage (LOC): ${Math.round(d.loc.coverage * 100)}% Lines Of Code: ${d.loc.total} -*`);
			totalLines += d.loc.total;
			totalRealLines += d.loc.all.length;
			totalLinesFound += d.loc.found;
		});

		console.log(`[+] Total Lines Of Code ${totalLines}`);
		console.log(`[+] Total Coverage: ${Math.round((totalLinesFound / totalRealLines) * 10000) / 100}%`);

		if (Config.printDeltaCoverage) {
			CoverageMap(coverage.lines(), line => console.log(line));
		} else {
			console.log("[+] EXPOSE_PRINT_COVERAGE=1 for line by line breakdown");
		}

		console.log(`[+] ExpoSE Finished. ${done.length} paths, ${errors} errors`);

		process.exitCode = errors;
		clearTimeout(maxTimeout);
	}).start(target, initialInput);
} else {
	console.log(`USAGE: ${process.argv[0]} ${process.argv[1]} target (Optional: initial input)`);
}

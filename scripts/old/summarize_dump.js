/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

var fs = require('fs');
var path = require('path');

let total = 0;
let failed = 0;
let attempts = 0;
let hitMax = 0;
let totalTime = 0;
let maxAttempts = 0;
let maxAttemptsGood = 0;
let complexExpressions = 0;
let cegarUsing = 0;
let containedRe = 0;

function processItem(data) {
	data = JSON.parse(data);
	total += 1;
	failed += data.model ? 1 : 0;
	hitMax += data.hitMaxRefinements ? 1 : 0;
	totalTime += (data.endTime - data.startTime);
	attempts += data.attempts;
	cegarUsing += data.attempts != 1 ? 1 : 0;
	maxAttempts = Math.max(maxAttempts, data.attempts);
	maxAttemptsGood = data.model ? Math.max(maxAttemptsGood, data.attempts) : maxAttemptsGood;
	complexExpressions += data.checkCount ? 1 : 0;

	if (data.containedRe) {
		containedRe++;
	}
}

function processFile(file) {
	let data = '' + fs.readFileSync(file);
	data = data.split('\nEXPOSE_QUERY_DUMP_SEPERATOR\n');
	data.forEach(element => {
		if (element.trim().length != 0) {
			processItem(element);
		}
	});
}

function rnd(x, dp) {
	return Math.round(x * dp) / dp;
}

function pct(t, of) {
	return rnd((t / of) * 100, 2) + '%';
}

function summ(dir) {
	fs.readdir(dir, function(err, list) {
	
		if (err) {
			console.log(err);
			return;
		}

		list.forEach(file => processFile(dir + '/' + file));

		console.log(`Queries took an average of ${rnd(totalTime / total, 2)}ms (total time in solver ${totalTime}ms) (total queries ${total})`);

		console.log(`${failed} / ${total} (${pct(failed, total)}) queries failed (unknown/unsat)`);
		console.log(`${hitMax} (${pct(hitMax, failed)}) queries failed (unknown result) because max refinements was hit.`);

		console.log(`${attempts} attempts in ${total} queries (${pct(attempts, total)})`);
		
		//Attempts per query info
		console.log(`Max attempts: ${maxAttempts}`);
		console.log(`Max attempts (with SAT): ${maxAttemptsGood}`);
		
		//Cegar info
		console.log(`CEGAR-potential queries: ${complexExpressions}`);
		console.log(`CEGAR-using quries: ${cegarUsing}`);
		
		if (cegarUsing) {
			console.log(`${pct(hitMax, cegarUsing)} CEGAR uses hit max-limit`);
		}

		console.log(`${containedRe} queries contained at least one RE`);
	});
}

if (process.argv.length > 2) {
	summ(process.argv[process.argv.length - 1]);
} else {
	console.log('No query dump provided');
}

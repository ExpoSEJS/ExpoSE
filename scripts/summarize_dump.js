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

function processFile(file) {
	let data = JSON.parse(fs.readFileSync(file));
	total += 1;
	failed += data.model ? 1 : 0;
	hitMax += data.hitMaxRefinements ? 1 : 0;
	totalTime += (data.endTime - data.startTime);
	attempts += data.attempts;
	cegarUsing += data.attempts != 1 ? 1 : 0;
	maxAttempts = Math.max(maxAttempts, data.attempts);
	maxAttemptsGood = data.model ? Math.max(maxAttemptsGood, data.attempts) : maxAttemptsGood;
	complexExpressions += data.checkCount ? 1 : 0;
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
		console.log(`${failed} / ${total} (${pct(failed, total)}) queries unsat, ${hitMax} because max refinements was hit`);
		console.log(`Queries took an average of ${totalTime / total}ms (total time in solver ${totalTime}ms) (total queries ${total})`);
		console.log(`${attempts} attempts in ${total} queries (${pct(attempts, total)})`);
		console.log(`Max attempts: ${maxAttempts}`);
		console.log(`Max attempts (with SAT): ${maxAttemptsGood}`);
		console.log(`CEGAR-potential queries: ${complexExpressions}`);
		console.log(`CEGAR-using quries: ${cegarUsing}`);
		console.log(`${pct(hitMax, cegarUsing)} CEGAR uses hit max-limit`);
	});
}

if (process.argv.length > 2) {
	summ(process.argv[process.argv.length - 1]);
} else {
	console.log('No query dump provided');
}


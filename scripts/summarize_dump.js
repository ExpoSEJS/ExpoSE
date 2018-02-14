var fs = require('fs');
var path = require('path');

let total = 0;
let failed = 0;
let hitMax = 0;
let totalTime = 0;

function processFile(file) {
	let data = JSON.parse(fs.readFileSync(file));
	total += 1;
	failed += data.model ? 1 : 0;
	hitMax += data.hitMaxRefinements ? 1 : 0;
	totalTime += data.endTime - data.startTime;
}

function summ(dir) {
	fs.readdir(dir, function(err, list) {
	
		if (err) {
			console.log(err);
			return;
		}

		list.forEach(file => processFile(dir + '/' + file));
		console.log(`${failed} / ${total} (${(failed / total) * 100}%) queries unsat, ${hitMax} because max refinements was hit`);
		console.log(`Queries took an average of ${totalTime / total}ms`);
	});
}

if (process.argv.length > 2) {
	summ(process.argv[process.argv.length - 1]);
} else {
	console.log('No query dump provided');
}


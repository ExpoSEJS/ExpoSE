/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

const spawn = require("child_process").spawn;
const REPLOTTER = "./scripts/replot";

function BuildGraph(outFile, outType, coverageFiles, inRate, done) {

	let args = [inRate.name, outFile, "", "", "", outType].concat(coverageFiles.map(x => x.name));

	console.log("Calling replot with " + args);

	let prc = spawn(REPLOTTER, args, {
		disconnected: false
	});

	prc.stdout.on("close", function(c) {
		this.running = false;
		done(c);
	}.bind(this));
}

module.exports = BuildGraph;

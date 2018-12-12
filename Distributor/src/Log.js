/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

const MOVE_LEFT = new Buffer("1b5b3130303044", "hex").toString();
const MOVE_UP = new Buffer("1b5b3141", "hex").toString();
const CLEAR_LINE = new Buffer("1b5b304b", "hex").toString();

/**
 * Mock to remove dependency on stringWidth
 * Will be correct as long as no unicode is used?
 */
function stringWidth(str) {
	return str.len;
}

const Logger = function(stream) {
	const write = stream.write;
	let str;

	stream.write = function(data) {
		if (str && data !== str) str = null;
		return write.apply(this, arguments);
	};

	if (stream === process.stderr || stream === process.stdout) {
		process.on("exit", function() {
			if (str !== null) stream.write("");
		});
	}

	let prevLineCount = 0;
	const log = function() {
		str = "";
		let nextStr = Array.prototype.join.call(arguments, " ");

		// Clear screen
		for (let i = 0; i < prevLineCount; i++) {
			str += MOVE_LEFT + CLEAR_LINE + (i < prevLineCount-1 ? MOVE_UP : "");
		}

		// Actual log output
		str += nextStr;
		stream.write(str);

		// How many lines to remove on next clear screen
		var prevLines = nextStr.split("\n");
		prevLineCount = 0;
		for (let i = 0; i < prevLines.length; i++) {
			prevLineCount += Math.ceil(stringWidth(prevLines[i]) / stream.columns) || 1;
		}
	};

	log.clear = function() {
		stream.write("");
	};

	return log;
};

const DefaultLogger = Logger(process.stdout);
let lastStep = 0;

function nextStep(i) {
	switch (i) {
	case 0: return "-";
	case 1: return "\\";
	case 2: return "|";
	case 3: return "/";
	case 4: return "-";
	case 5: return "\\";
	case 6: return "|";
	case 7: return "/";
	}
}

export default function(line) {
	
	//Log with the current step of the spinner
	DefaultLogger(`[${nextStep(lastStep++)}] ${line}`);
	
	//Check for spinner reset
	if (lastStep == 8) {
		lastStep = 0;
	}
}

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

const os = require("os");

function argToType(arg, type) {
	return type === "number" ? parseInt(arg) : arg;
}

function getArgument(name, type, dResult) {
	return process.env[name] ? argToType(process.env[name], type) : dResult;
}

function maxConcurrent() {
	const defaultCpuCores = os.cpus().length;
	const fromArgOrDefault = getArgument("EXPOSE_MAX_CONCURRENT", "number", defaultCpuCores);
	return fromArgOrDefault;
}

function timeFrom(envArg, defaultVal) {
	const SECOND = 1000;
	const MINUTE = SECOND * 60;
	const HOUR = MINUTE * 60;

	function timeToMS(timeString) {
		const suffix = timeString[timeString.length - 1];

		if (suffix === "s") {
			return SECOND * Number.parseInt(timeString.slice(0, -1));
		} else if (suffix === "m") {
			return MINUTE * Number.parseInt(timeString.slice(0, -1));
		} else if (suffix === "h") {
			return HOUR * Number.parseInt(timeString.slice(0, -1));
		} else {
			return Number.parseInt(timeString);
		}
	}

	return timeToMS(getArgument(envArg, "string", defaultVal));
}

export default {
	maxConcurrent: maxConcurrent(), //max number of tests to run concurrently
	maxTime: timeFrom("EXPOSE_MAX_TIME", "2h"),
	testMaxTime: timeFrom("EXPOSE_TEST_TIMEOUT", "40m"),
	jsonOut: getArgument("EXPOSE_JSON_PATH", "string", undefined), //By default ExpoSE does not generate JSON out
	printPaths: getArgument("EXPOSE_PRINT_PATHS", "number", false), //By default do not print paths to stdout
	printDeltaCoverage: getArgument("EXPOSE_PRINT_COVERAGE", "number", false),
	printPathCondition: getArgument("EXPOSE_PRINT_PC", "number", false),
	perCaseCoverage: getArgument("EXPOSE_CASE_COVERAGE", "number", false), /* Prints coverage information on the finished path */
	analyseScript: getArgument("EXPOSE_PLAY_SCRIPT", "string", "./scripts/play")
};

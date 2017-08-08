/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

/**
 * Class to handle logging
 * Structured this way for historical reasons, unneeded 
 * logs are now removed at compile for performance
 */
 
class Log {
	logHigh(msg) {
		console.log('ExpoSE HIGH: ' + msg);
	}

	logMid(msg) {
		console.log('ExpoSE MID: ' + msg);
	}

	log(msg) {
		console.log('ExpoSE: ' + msg);
	}
}

export default new Log();

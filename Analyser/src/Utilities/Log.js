/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Config from '../Config';
const fs = require('fs');

function makeid(count) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < count; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

const path_dump_id = makeid(4);

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

	logQuery(clause, solver, checkCount, startTime, endTime, model, attempts, hitMax) {

		if (!Config.outQueriesDir) {
            return;
        }

        const dumpData = {
            clause: clause,
            solver: solver,
            model: model,
            attempts: attempts,
            startTime: startTime,
            endTime: endTime,
            hitMaxRefinements: hitMax,
            checkCount: checkCount
        };

        const dumpFileName = Config.outQueriesDir + '/' + path_dump_id +'_' + (new Date()).getTime() + '_' + makeid(5);

        fs.writeFileSync(dumpFileName, JSON.stringify(dumpData));

        this.log(`Wrote ${dumpFileName}`);
	}
}

export default new Log();

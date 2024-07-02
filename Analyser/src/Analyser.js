/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

/*global J$*/

// do not remove the following comment
// JALANGI DO NOT INSTRUMENT
//
// Symbolic execution analyser entry point

import SymbolicExecution from "./SymbolicExecution";
import Config from "./Config";
import Log from "./Utilities/Log";
import External from "./External";

const fs = External.load("fs");
const process = External.load("process");

const input = process.argv[process.argv.length - 1];

Log.logHigh("Built with VERY logging enabled");
Log.logMid("Built with FINE logging enabled");
Log.log("Built with BASE logging enabled");
Log.log("Intial Input " + input);

process.title = "ExpoSE Play " + input;

process.on("disconnect", function () {
  Log.log("Premature termination - Parent exit");
  process.exit();
});

J$.analysis = new SymbolicExecution(
  J$,
  JSON.parse(input),
  (state, coverage) => {
    Log.log("Finished play with PC " + state.pathCondition.map((x) => x.ast));

    if (Config.outCoveragePath) {
      fs.writeFileSync(Config.outCoveragePath, JSON.stringify(coverage.end()));
      Log.log("Wrote final coverage to " + Config.outCoveragePath);
    } else {
      Log.log("No final coverage path supplied");
    }

    //We record the alternatives list as the results develop to make the output tool more resilient to SMT crashes
    state.alternatives((current) => {
      const finalOut = {
        pc: state.finalPC(),
        input: state.input,
        errors: state.errors,
        alternatives: current,
        stats: state.stats.export(),
      };

      if (Config.outFilePath) {
        fs.writeFileSync(Config.outFilePath, JSON.stringify(finalOut));
        Log.log("Wrote final output to " + Config.outFilePath);
      } else {
        Log.log("No final output path supplied");
      }
    });
  },
);

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

import FileTransformer from "./FileTransformer";
import Internal from "./Internal";
require("colors");

function generateCoverageMap(lineInfo, callback) {
  for (const filename in lineInfo) {
    if (!Internal(filename)) {
      FileTransformer(filename).then((data) => {
        console.log(`[+] Line Coverage for ${filename} `);

        const lines = data.trim().split("\n");
        const linesWithTouched = lines.map((line, idx) => {
          const lineNumber = idx + 1;

          let indicator = "s";

          if (lineInfo[filename].all.find((i) => i == lineNumber)) {
            if (lineInfo[filename].touched.find((i) => i == lineNumber)) {
              indicator = "+";
            } else {
              indicator = "-";
            }
          }

          const formattedLine = indicator == "-" ? line.bgRed : line.bgGreen;
          const outputLine = `${lineNumber}${formattedLine}`;
          return outputLine;
        });

        linesWithTouched.forEach((line) => callback(line));
      });
    }
  }
}

export default generateCoverageMap;

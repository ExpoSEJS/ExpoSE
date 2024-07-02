/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

import { spawn } from "child_process";

const EXPOSE_TEST_SCRIPT = "./expoSE";

class Tester {
  constructor(file) {
    this.file = file;
    this.out = "";
  }

  build(done) {
    let env = process.env;
    env.EXPOSE_EXPECTED_PC = this.file.expectPaths;

    let prc = spawn(EXPOSE_TEST_SCRIPT, [this.file.path], {
      env: env,
    });

    prc.stdout.setEncoding("utf8");
    prc.stderr.setEncoding("utf8");
    prc.stdout.on("data", (data) => (this.out += data.toString()));
    prc.stderr.on("data", (data) => (this.out += data.toString()));

    let startTime = Date.now();

    const SECOND = 1000;
    const TIME_WARNING = 60;

    let longRunningMessage = undefined;

    let ref = this;

    function queueTimeout() {
      longRunningMessage = setTimeout(() => {
        console.log(
          `\r${ref.file.path} has taken ${(Date.now() - startTime) / 1000}s to run`,
        );
        queueTimeout();
      }, TIME_WARNING * SECOND);
    }

    queueTimeout();

    prc.on("close", (code) => {
      clearTimeout(longRunningMessage);
      done(code, Date.now() - startTime);
    });
  }
}

export default Tester;

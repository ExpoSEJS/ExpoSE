[![Build Status](https://travis-ci.com/ExpoSEJS/ExpoSE.svg?branch=master)](https://travis-ci.org/ExpoSEJS/ExpoSE)

## ExpoSE

ExpoSE is a dynamic symbolic execution engine for JavaScript, developed at Royal Holloway, University of London by [Blake Loring](https://www.parsed.uk), Duncan Mitchell, and [Johannes Kinder](https://www.unibw.de/patch) (now at [Bundeswehr University Munich](https://www.unibw.de/)). 
ExpoSE supports symbolic execution of Node.js programs and JavaScript in the browser. ExpoSE is based on Jalangi2 and the Z3 SMT solver.

### Requirements

Requires `node` version v7.5.0 (other versions may work but are not tested), `npm`, `clang` (with `clang++`), `gnuplot` (for coverage graphs), `make`, `python2` (as python in path).

`mitmproxy` (Depends libxml2-dev, libxslt-dev, libssl-dev) is required for electron analysis.

### Installation

Execute `npm install` inside the ExpoSE directory for a clean installation.

### ExpoSE GUI

In most cases you want to start by running the ExpoSE dashboard. The GUI provides detailed test case information, easy replay, and coverage graphs. Start the ExpoSE dashboard with

```sh
$ npm start
```

### ExpoSE CLI

Alternatively, you can invoke ExpoSE directly via the `expoSE` command line interface.

Example:

```sh
$ expoSE ./tests/numbers/infoflow
```

Valid Options:

* `replay`     - Replay a test case with a specific input.
* `ahg`        - Automatically generate a generic test harness for a specified NPM library.

### ExpoSE Browser Support

There is limited support for symbolic execution of webpages through a custom Electron based web browser. To execute ExpoSE on a website you use the same arguments as the CLI. Note: This also requires python3 and a modern version of mitmproxy to function correctly.

```sh
$ expoSE "https://google.com"
```

### Configuration

ExpoSE is configured via environment variables. All work both with the ExpoSE GUI and ExpoSE CLI. Typically these can be set from a terminal by writing a command such as

```sh
$ EXPOSE_LOG_LEVEL=1 expoSE target/hello.js
```

* `EXPOSE_MAX_TIME`         - The time (in milliseconds) to limit the total execution
* `EXPOSE_TEST_TIMEOUT`     - The time (in milliseconds) a test case can run for before being timed out
* `EXPOSE_PRINT_COVERAGE`   - Print out the files checked by an analysis and show the lines which where explored by the analyzer
* `EXPOSE_PRINT_PATHS`      - Print the output of each test case to stdout
* `EXPOSE_LOG_LEVEL`        - Level from 0 (None) to 3 (High)
* `EXPOSE_MAX_CONCURRENT`   - The maximum number of test cases that can run concurrently
* `RECOMPILE`               - Force ExpoSE to rebuild before executing scripts

NOTE: To improve performance logging instructions are removed from the output at compile time and so will not be updated if `NO_COMPILE` is set.

### Publications

* Blake Loring, Duncan Mitchell, and Johannes Kinder. [Sound Regular Expression Semantics for Dynamic Symbolic Execution of JavaScript](https://www.unibw.de/patch/papers/pldi19-regex.pdf). In _Proc. ACM SIGPLAN Conf. Programming Language Design and Implementation (PLDI)_, pp. 425–438, ACM, 2019.
* Blake Loring, Duncan Mitchell, and Johannes Kinder. [ExpoSE: Practical Symbolic Execution of Standalone JavaScript](https://www.unibw.de/patch/papers/spin17-expose.pdf). In _Proc. Int. SPIN Symp. Model Checking of Software (SPIN)_, pp. 196–199, ACM, 2017.

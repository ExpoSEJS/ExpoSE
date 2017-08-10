## ExpoSE.js

A symbolic execution engine for JavaScript.

### Requirements

Requires `node` version v7.5.0 (Others should work but no support is guaranteed), `npm`, `clang`, `clang++`, `gnuplot`, `make`, `mitmproxy` (Depends libxml2-dev, libxslt-dev, libssl-dev), `python2` (as python in path).

### First time setup

The first time `npm start` is executed ExpoSE will be setup, this process can take a long time (up to 30 minutes) collecting and installing dependencies. The install script will attempt to add expoSE to your bash profile during the process. To manually setup expose execute `./expoSE setup`

### ExpoSE GUI

In most cases cases the ExpoSE GUI. The UI provides detailed test case information, easy replay and coverage graphs. Start the ExpoSE dashboard with

```sh
$ npm start
```

### ExpoSE CLI

All basic ExpoSE functionality is exposed through the expoSE CLI script.

Example:

```sh
$ expoSE test ./tests/integers/infoflow
```

Valid Options:

* `setup` - Clean and setup ExpoSE
* `test` - Symbolically execute a Node.js program.
* `ui` - Launch the ExpoSE Dashboard
* `replay` - Replay a test case with a specific input.
* `test_suite` - Run the pre-push test suite.

### Configuration

All environment flags work both with the ExpoSE Dashboard and ExpoSE CLI. Typically these can be set from a terminal by writing a command such as

```sh
$ EXPOSE_LOG_LEVEL=1 expoSE test target/hello.js
```

* `NO_COMPILE` - Don't rebuild ExpoSE before executing scripts
* `EXPOSE_PRINT_PATHS` - Print the output of each test case to stdout
* `EXPOSE_LOG_LEVEL` - Level from 0 (None) to 3 (High)
* `EXPOSE_MAX_CONCURRENT` - The maximum number of test cases that can run concurrently
* `EXPOSE_TEST_TIMEOUT` - The time (in milliseconds) a test case can run for before being timed out
* `EXPOSE_MAX_PATHS` - The maximum number of test cases to execute
* `EXPOSE_PRINT_COVERAGE` - Print out the files checked by an analysis and show the lines which where explored by the analyzer
* `NO_CLEANUP` - When executing `expoSE setup` don't clean existing installation

NOTE: To improve performance logging instructions are removed from the output at compile time and so will not be updated if `NO_COMPILE` is set.
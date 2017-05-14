## ExpoSE.js

A symbolic execution engine for JavaScript.

### Installation

Requires `node` version v7.5.0 (Others should work but no support is guaranteed), `npm`, `clang`, `clang++`, `gnuplot`, `make`, `mitmproxy` (Depends libxml2-dev, libxslt-dev, libssl-dev), `python2` (as python in path).

To build all other dependencies and install, execute

```sh
$ npm install
```

from the command line.

Note: no administrator privileges are required, but the environment assumes either a standard(ish) Linux distribution with bash or OS X.

This will also add ExpoSE to your path, restarting your terminal should allow expoSE to be executed from anywhere.

### ExpoSE GUI

In most cases cases the ExpoSE GUI. The UI provides detailed test case information, easy replay and coverage graphs. Start the ExpoSE dashboard with

```sh
$ npm start
```
or
```sh
$ expoSE ui
```

### ExpoSE CLI

All basic ExpoSE functionality is exposed through the expoSE CLI script.

Example:

```sh
$ expoSE test ./tests/integers/infoflow
```

Valid Options:

* `setup` - Clean and instantiates the environment (Called by NPM install).
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
* `NO_CLEANUP` - When executing `expoSE setup` don't clean existing installation

NOTE: To improve performance logging instructions are removed from the output at compile time and so will not be updated if `NO_COMPILE` is set.
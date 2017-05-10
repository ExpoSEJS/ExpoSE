## ExpoSE.js

A symbolic execution engine for JavaScript, built using _Jalangi 2_.

### Installation

Requires `node` version v7.5.0 (Others should work but no support is guaranteed), `npm`, `clang`, `clang++`, `gnuplot`, `make`, `mitmproxy` (Depends libxml2-dev, libxslt-dev, libssl-dev), `python2` (as python in path).

To build all other dependencies and install, execute

```sh
$ npm install
```

from the command line.

Note: no administrator privileges are required, but the environment assumes either Mac OS X or a standard(ish) Linux distribution.

This will also add ExpoSE to your path, restarting your terminal should allow expoSE to be executed from anywhere.

### ExpoSE GUI

Start the ExpoSE dashboard with

```sh
$ npm start
```

### ExpoSE CLI

All basic ExpoSE functionality is exposed through the expoSE CLI script. Valid options are `setup`, `test`, `replay` and `test_suite`.

`setup` sets up the environment and pulls most dependencies.
`test` symbolically executes a given test.
`replay` replays a test case with a specific input.
Finally `test_suite` is used to test whether any changes break the interpreter.

### Run without rebuilding

The environment flag NO_COMPILE=1 will make the expoSE script stop recompiling the entire framework between runs (Useful if no source changes are being made)

Example:

```sh
$ NO_COMPILE=1 expoSE target/hello.js
```

NOTE: Logging instructions are removed from the output at compile time so this command conflicts with EXPOSE_LOG_LEVEL being changed

### Configuration

All environment flags work both with the ExpoSE Dashboard and ExpoSE CLI. Typically these can be set from a terminal by writing a command such as

```sh
$ EXPOSE_LOG_LEVEL=1 expoSE test target/hello.js
```

`EXPOSE_PRINT_PATHS` - Print the output of each test case to stdout

`EXPOSE_LOG_LEVEL` - Level from 0 (None) to 3 (High)

`EXPOSE_MAX_CONCURRENT` - The maximum number of test cases that can run concurrently

`EXPOSE_TEST_TIMEOUT` - The time (in milliseconds) a test case can run for before being timed out

`EXPOSE_MAX_PATHS` - The maximum number of test cases to execute

### Setup without Cleanup

In some rare cases you may want to rerun setup without the cleanup script executing. The environment flag NO_CLEANUP=1 can be used to force this.

```sh
$ NO_CLEANUP=1 ./expoSE setup
```

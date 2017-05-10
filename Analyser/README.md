#Analyser

The core of the symbolic analyser, executes a test script symbolically and reports any errors

#Program Output
The final output of the program will be the number of script errors that have occured (through fail()) or the error code magic number
If the result of the run is 0xDEADBAD this indicates an internal error has occured.

#Expected Paths
The analyser can take an optional integer as the expected path count, if PC != this integer then the program will exit with an additional error (errorCount + 1) to indicate this.

To run it with an expected PC execute ./expoSE FILENAME --expected pathcount

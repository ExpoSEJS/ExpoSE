const MOVE_LEFT = new Buffer('1b5b3130303044', 'hex').toString();
const MOVE_UP = new Buffer('1b5b3141', 'hex').toString();
const CLEAR_LINE = new Buffer('1b5b304b', 'hex').toString();

/**
 * Mock to remove dependency on stringWidth
 * Will be correct as long as no unicode is used?
 */
function stringWidth(str) {
    return str.len;
}

const Logger = function(stream) {
    const write = stream.write;
    let str;

    stream.write = function(data) {
        if (str && data !== str) str = null;
        return write.apply(this, arguments);
    };

    if (stream === process.stderr || stream === process.stdout) {
        process.on('exit', function() {
            if (str !== null) stream.write('');
        });
    }

    let prevLineCount = 0;
    const log = function() {
        str = '';
        let nextStr = Array.prototype.join.call(arguments, ' ');

        // Clear screen
        for (let i = 0; i < prevLineCount; i++) {
            str += MOVE_LEFT + CLEAR_LINE + (i < prevLineCount-1 ? MOVE_UP : '');
        }

        // Actual log output
        str += nextStr;
        stream.write(str);

        // How many lines to remove on next clear screen
        var prevLines = nextStr.split('\n');
        prevLineCount = 0;
        for (let i = 0; i < prevLines.length; i++) {
            prevLineCount += Math.ceil(stringWidth(prevLines[i]) / stream.columns) || 1;
        }
    };

    log.clear = function() {
        stream.write('');
    };

    return log;
};

export default Logger(process.stdout);

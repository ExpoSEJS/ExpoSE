const fs = require('fs');
const Tropigate = require('Tropigate').default;

const logFile = JSON.parse(fs.readFileSync(process.argv[process.argv.length - 1]));

function findInSmap(line, col, smap) {
    for (let id in smap) {
        const el = smap[id];
        if (el.line == line && el.character == col) {
            return id;
        }
    }

    return undefined;
}

function printOut(coverage) {
    for (file of coverage) {
        if (!file.file.includes('symbols')) { //Ignore harness
            const fileText = Tropigate('' + fs.readFileSync(file.file));
            console.log(file.file);

            const lines = fileText.split('\n');

            lines.forEach((line, lineno) => {

                for (let i = 0; i < line.length; i++) {
                    const smapId = findInSmap(lineno + 1, i + 1, file.smap);
                    if (smapId !== undefined && smapId % 4 == 0) {
                        if (file.branches[smapId] & 0x2) {
                            process.stdout.write('\033[32m');
                        } else {
                            process.stdout.write('\033[31m');
                        }
                    } else if (smapId !== undefined) {
                        if (file.branches[smapId] & 0x1) {
                            process.stdout.write('\033[32m');
                        } else {
                            process.stdout.write('\033[31m');
                        }
                    }  else { 
                        process.stdout.write('\033[30m');
                    }

                    process.stdout.write(line[i]);
                }
                process.stdout.write('\033[0m');
                process.stdout.write('\n');
            });
        }
    }
}

logFile.done.forEach(tc => {
    console.log('Test Case: ', tc.pc, JSON.stringify(tc.input));
    printOut(tc.case_coverage);
});

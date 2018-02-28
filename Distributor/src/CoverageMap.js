import FileTransformer from './FileTransformer';

function generateCoverageMap(lineInfo, callback) {
    for (const filename in lineInfo) {
        FileTransformer(filename).then(data => {
            console.log(`*- Experimental Line Coverage for ${filename} `);
            const lines = data.split('\n');
            const linesWithNumbers = lines.map((line, idx) => `${idx + 1}:${line}`);

            const linesWithTouched = lines.map((line, idx) => {
                const lineNumber = idx + 1;
                if (!lineInfo[filename].all.find(i => i == lineNumber)) {
                    return `s${line}`;
                } else if (lineInfo[filename].touched.find(i => i == lineNumber)) {
                    return `+${line}`;
                } else {
                    return `-${line}`;
                }
            });

            linesWithTouched.forEach(line => callback(line));
        });
    }
}

export default generateCoverageMap;
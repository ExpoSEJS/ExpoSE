/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

import path from "path";

class Walker {
    constructor(dir, fn) {
        this.cbs = [];
        this.dir = dir;
        this.fn = fn;
    }

    start() {
        let absTestFilePath = path.resolve(this.dir + this.fn);
        let fileList = require(absTestFilePath);
        
        this.files = fileList.map(f => ({
            path: this.dir + f.path,
            expectErrors: f.expectErrors,
            expectPaths: f.expectPaths
        }));

        this.doneSearching();
        return this;
    }

    doneSearching() {
        this.cbs.forEach(cb => cb(this.files));
    }

    done(cb) {
        this.cbs.push(cb);
        return this;
    }
}

export default Walker;

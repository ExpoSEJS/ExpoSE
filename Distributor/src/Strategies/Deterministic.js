/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

class Strategy {
	
	constructor() {
		this._tests = [];
	}

	add(target, sourceInfo) {
    this._tests.push(target);
	}

	next() {
    return this._tests.shift();
	}

	length() {
		return this._tests.length;
	}
}

export default Strategy;

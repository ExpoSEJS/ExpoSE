/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

class Strategy {
	
	constructor() {
		this._tests = [];
	}

	add(target, sourceInfo) {
    this._tests.push(target);
	}

	next() {
    const selected = Math.floor(Math.random() * this._tests.length);
    return this._tests.splice(selected, selected)[0];
	}

	length() {
		return this._tests.length;
	}
}

export default Strategy;

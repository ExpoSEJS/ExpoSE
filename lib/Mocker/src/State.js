/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

class State {
	constructor(initial) {
		this._current = initial;
	}

	setState(newState) {
		this._current = newState;
	}

	getState() {
		return this._current;
	}
}

export default State;

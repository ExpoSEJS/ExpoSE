/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import NetworkState from '../NetworkState';
import Handler from '../../Handler';

const States = {
	Off: 0,
	On: 1
};

class LoginHandler extends Handler {
	shouldHandle(state, request) {
		return request.getUrl() === '/login';
	}

	handle(state, request, callback) {
		let key = '' + Math.random();
		state._keys.push(key)
		callback('' + key, undefined);
	}
}

class SetStateHandler extends Handler {
	shouldHandle(state, request) {
		return request.getUrl() === '/setstate';
	}

	handle(state, request, callback) {
		if (state._keys.find(x => x === request.data.ukey)) {
			if (request.data.dstate === 'ON') {
				state.setState(States.On);
			} else if (request.data.dstate === 'OFF') {
				state.setState(States.Off);
			}
		}
	}
}

class LoginRest extends NetworkState {
	constructor() {
		super(States.Off, [new LoginHandler(), new SetStateHandler()]);
		this._keys = [];
	}
}

export default LoginRest;

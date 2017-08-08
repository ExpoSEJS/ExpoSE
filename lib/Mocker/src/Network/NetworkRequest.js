/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

class NetworkRequest {
	constructor(url, data) {
		this._url = url;
		this._data = data;
	}

	getUrl() {
		return this._url;
	}

	getData() {
		return this._data;
	}
}

export default NetworkRequest;

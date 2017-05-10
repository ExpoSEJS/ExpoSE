/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

class XMLHttpRequest {
	getResponseHeader() {
		return 'SOMESTRINGOFSTUFF';
	}

	getAllResponseHeaders() {
		return 'SOMESTRINGOFSTUFF';
	}

	open() {}

	send() {
		if (this.onreadystatechange) {
			this.onreadystatechange();
		}
	}

	abort() {}
}

XMLHttpRequest.prototype.onreadystatechange = null;
XMLHttpRequest.prototype.readyState = 4;

XMLHttpRequest.prototype.response = "DUMMYRESPONSE";
XMLHttpRequest.prototype.responseText = "DUMMYRESPONSE";
XMLHttpRequest.prototype.responseType = "text";

export default {
	setup: function() {
		global.XMLHttpRequest = XMLHttpRequest;
	}
};

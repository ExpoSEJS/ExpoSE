/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

class Element {
	Element(type, id) {
		this._type = type;
		this._id = id;
	}

	compareDocumentPosition() {
		return 1;
	}
}

class Document {
	createElement(type) {
		return new Element();
	}

	getElementById(id) {
		return new Element('div', id);
	}
}

Document.prototype.documentElement = new Element('html');

export default {
	setup: function() {
		global.document = new Document();
	}
}

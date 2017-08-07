/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Request from './Network/NetworkRequest';

export default {
	replace: function(object, index, value) {
		object[index] = value;
	},
	nop: function() {}
}

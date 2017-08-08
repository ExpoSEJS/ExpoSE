/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

export default {
	add: function(array, item) {
		array.push(item);
		return array;
	},

	addIf: function(condition, array, item) {
		return condition ? ArrayHelper.add(array, item) : array;
	}
};

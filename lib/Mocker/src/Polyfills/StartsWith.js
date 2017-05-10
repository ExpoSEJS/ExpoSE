/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

export default {
	setup: function() {
		if (!String.prototype.startsWith) {
		    String.prototype.startsWith = function(searchString, position){
		      position = position || 0;
		      return this.substr(position, searchString.length) === searchString;
		  };
		}
	}
};

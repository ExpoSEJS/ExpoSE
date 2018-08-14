/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

export default {

    load: function (library) {
        if (this.is_external()) {
            return require('electron').remote.require(library);
        } else {
	        return require(library);
        }
    },

    is_external: function() {
        return typeof window !== 'undefined';
    }

};

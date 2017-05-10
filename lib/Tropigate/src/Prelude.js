/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

export default function(src, doInjection) {

    function includes(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };

    if (!includes.call(src, '"no_prelude";')) {
        src = "var __secret__S$ = require(\'S$\'); var __secret__traits__ = __secret__S$.Traits;\n" + src;
    }

    return src;
}

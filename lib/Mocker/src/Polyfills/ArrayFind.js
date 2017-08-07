/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

//From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
export default {
  setup: function() {
    if (!Array.prototype.find) {
      Array.prototype.find = function(predicate) {
        
        if (this === null) {
          throw new TypeError('Array.prototype.find called on null or undefined');
        }

        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }

        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }

        return undefined;
      };
    }
  }
};

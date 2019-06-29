/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

import Log from './Log';

/** 
 * Some code is from https://gist.github.com/jdalton/5e34d890105aca44399f by John-David Dalton
 */

const toString = Object.prototype.toString;
const fnToString = Function.prototype.toString;
const reHostCtor = /^\[object .+?Constructor\]$/;
const SECRET_CACHE_STR = "__checked_isNative__before__";

var reNative = RegExp("^" +
    String(toString)
        .replace(/[.*+?^${}()|[\]\/\\]/g, "\\$&")
        .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);

function isNativeCore(value) {

		if (value.hasOwnProperty('toString')) {
			Log.log('WARNING: IsNative will not work on custom toString methods. We assume nobody would overwrite core method toStrings');
			return false;
		}

		if (typeof(value) === "function") {
			return reNative.test(fnToString.call(value)); 
		} else if (typeof(value) === "object") {
			return reHostCtor.test(toString.call(value));
		} else {
			return false;
		}
}

function isNative(v) {
  Log.logMid('TODO: IsNative Uncached');
  const type = typeof v;

	if (v === null || v === undefined) {
		Log.logMid('IsNative on undef/nul');
		return false;
	}

	if (typeof(v) === "function" || typeof(v) === "object") {
		return isNativeCore(v);
	} else {
		Log.logMid('IsNative called on non fn/obj');
		return false;
	}
}

export {isNative};

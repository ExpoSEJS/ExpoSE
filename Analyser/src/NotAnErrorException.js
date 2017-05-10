/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

/**
 * Thrown by the underlying script when the run should immediately terminate without an error
 */
 
class NotAnErrorException {
	toString() {
		return 'NotAnErrorException';
	}
}

export default NotAnErrorException;

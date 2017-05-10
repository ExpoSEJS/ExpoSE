/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import NodeHTTPRequest from './NodeHttpRequest';
import NodeWindow from './NodeWindow';
import NodeNavigator from './NodeNavigator';

export default {
	setup: function() {
		NodeWindow.setup();
		NodeHTTPRequest.setup();
		NodeNavigator.setup();
	}
};

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import LoginRest from './LoginRest';
import NetworkRequest from '../NetworkRequest';

let RestServer = new LoginRest();

function sendMessage(url, data, doneCallback, errorCallback) {
	let request = new NetworkRequest(url, data);

	function hRes(data, err) {
		if (err) {
			errorCallback(err);
		} else {
			doneCallback(data);
		}
	}

	RestServer.handleRequest(request, hRes);
}

sendMessage('/data', null, function(data) { throw 'Should not ever be executed'; }, function(err) { console.log('First data failed'); });
sendMessage('/login', null, function(data) { console.log('Logged In'); }, function(err) { throw 'Should not be hit'; })
sendMessage('/data', null, function(data) { console.log('Got the data ' + data); }, function(err) { throw 'Should not be hit'; });

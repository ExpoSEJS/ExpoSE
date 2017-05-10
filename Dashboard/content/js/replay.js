/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

const remote = require('electron').remote;
const Executor = remote.require('../src/expose_executor');
const view = require('./view');

module.exports = function(file, input) {
	Executor(file, input, function(data) {
		view.out('' + data);
	}, function() {
	});
}

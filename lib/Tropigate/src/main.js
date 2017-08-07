/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import tropigate from './Tropigate';
import Prelude from './Prelude';

let acorn = require('acorn');
let escodegen = require('escodegen');

function dEnv(field, dVal) {
	return process.env[field] !== undefined ? process.env[field] : dVal;
}

let doInjection = dEnv('TROP_DO_INJECT', 'YES') != 'NO';

//Inject tropigate
tropigate(acorn, doInjection);

function convert(src, opts, shouldCommentOut) {

	let comments = [],
		tokens = [];

	opts.plugins = {
		tropigate: true
	};

	opts.onComment = comments;
    opts.onToken = tokens;

	//Use plugin to transform the source
	let ast = acorn.parse(Prelude(src, doInjection), opts);

	if (shouldCommentOut) {
		escodegen.attachComments(ast, comments, tokens);
	}

	return escodegen.generate(ast, {
		comments: true
	});
}

export default convert;

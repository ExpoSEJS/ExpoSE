/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

var S$ = require('S$');

var HARNESS_KEY = 'EXPOSE_HARNESS_TARGET';
var MAX_DEPTH_LIMIT = 15;

function Construct(base, fn) {

	var args = [];

	for (var i = 0; i < fn.length; i++) {
		args.push(S$.symbol('Constructed_Argument'));
	}

  var createAsClass = S$.symbol('CreateAsClass', false); 

	//Classes need special constructors
	if (createAsClass) {
		return new (Function.prototype.bind.apply(fn, [null].concat(args)));
	} else {
		return fn.apply(base, args);
	}
}

/**
 * Expands an object/function to explore all properties
 * 
 * @param {any} switcher The symbolic value
 * @param {any} target The object to be expanded. 
 */
function ExpandObj(target, depth) {

	var properties = [];

	for (var i in target) {
		if (typeof target[i] === "function") {
			properties.push(i);
		}
	}

	var switcher = S$.symbol('ExpandObjSwitcher', 0);
  var nextItem = target[properties[switcher]];
  Expand(Construct(target, nextItem), depth);
}

function Expand(target, depth) {
	
  if (depth == MAX_DEPTH_LIMIT) {
    console.log('AHG hit max depth');
    return;
  }

  var obj_mode = true;

  if (typeof target === "function") {
		obj_mode = S$.symbol('ExpandSwitch', false); //symbolic ExpandSwitch initial false;
	}

  depth++;

	if (typeof target === "object" && target !== null && obj_mode) {
		ExpandObj(target, depth);
	} else {
		Expand(Construct(target, target), depth);
	}
}

// Require your NPM library
console.log('Attaching Harness to ' + process.env[HARNESS_KEY]);
var target = require(process.env[HARNESS_KEY]);
Expand(target, 0);

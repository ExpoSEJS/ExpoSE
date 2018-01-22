"use strict";

var HARNESS_KEY = 'EXPOSE_HARNESS_TARGET';

function Construct(base, fn) {

	var args = [];

	for (var i = 0; i < fn.length; i++) {
		args.push(symbolic Constructed_Argument);
	}

	//Classes need special constructors
	if (fn.toString().indexOf('class')) {
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
function ExpandObj(target) {
	var switcher = symbolic ExpandObjSwitcher initial 0;
	var properties = [];

	for (let i in target) {
		if (typeof target[i] === "function") {
			properties.push(i);
		}
	}

	for (var functionIndex = 0; functionIndex < properties.length; functionIndex++) {
		if (switcher == functionIndex) {
            var targetFunction = target[properties[functionIndex]];
			
			// Can't do a for loop without erasing the symbolic nature of all but the last variable
			// TODO Make a array with a custom getter that returns a new symbol on unknown lookups and then records it
			Expand(Construct(target, targetFunction));
		}
	}
}

function Expand(target) {
	var obj_mode = true;

	console.log('Testing ' + target.toString() + ', JSON ' + JSON.stringify(target));

	if (typeof target === "function") {
		obj_mode = symbolic ExpandSwitch initial false;
	}

	if (typeof target === "object" && target !== null && obj_mode) {
		ExpandObj(target);
	} else {
		Expand(Construct(target, target));
	}
}

// Require your NPM library
console.log('Attaching Harness to ' + process.env[HARNESS_KEY]);
var target = require(process.env[HARNESS_KEY]);
Expand(target);
"use strict";

var HARNESS_KEY = 'EXPOSE_HARNESS_TARGET';

// Require your NPM library
console.log('Attaching Harness to ' + process.env[HARNESS_KEY]);

var target = require(process.env[HARNESS_KEY]);

function Construct(base, fn) {

	var args = [];

	for (var i = 0; i < fn.length; i++) {
		args.push(symbolic ExpansionArg);
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
function Expand(switcher, target) {
	var properties = [];

	for (let i in target) {
		if (typeof target[i] === "function") {
			properties.push(i);
		}
	}

	for (var functionIndex = 0; functionIndex < properties.length; functionIndex++) {
		if (switcher == functionIndex) {
            var targetFunction = target[properties[functionIndex]];
            console.log('Testing ' + targetFunction + ' ' + target[targetFunction]);
			
			// Can't do a for loop without erasing the symbolic nature of all but the last variable
			// TODO Make a array with a custom getter that returns a new symbol on unknown lookups and then records it
			var targetResults = Construct(target, targetFunction);
			Expand(symbolic ExpandedSwitcher initial 0, targetResults);
		}
	}
}

// Creates the symbolic variable to explore all possible functions and constructing an object
var switcher = symbolic Switcher initial false;

if (typeof target === "function" && switcher) {
	var constructedObject = Construct(this, target);
	var constructedObjectSwitcher = symbolic Target_Switcher initial 0;
	Expand(constructedObjectSwitcher, constructedObject);
} else {
	Expand(symbolic Target_Switch_Base initial 0, target);
}
/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

/**
 * Preample - Harness traits standard library
 */

traitdef IntChecked;

function WrapIntCheck(scope, fields) {
	fields.forEach(function(field) {
		var old = scope[field];
		if (old) {
			scope[field] = function() {
				return old.apply(this, arguments) as <! IntChecked !>;
			}
		}
	});
}

var opInt = parseInt;
parseInt = function() { opInt.apply(this, arguments) as <! IntChecked !>; };

WrapIntCheck(Math, ['ceil', 'trunc', 'floor', 'round']);

/**
 * End of preamble
 */

 function DoSensetiveOp(data, start: <!IntChecked!>, end: <!IntChecked!>) {

 }

if (symbolic A initial true) {
	DoSensetiveOp([1,2,3], 5, 6); //Bad: Not necessarily 
} else {
	DoSensetiveOp([1,2,3], Math.floor(6), parseInt("62", 10));
}

/**
 * This test case checks that we don't break concrete calls for some modelled functions
 * (As the concrete pathway is the same for all modelled calls hopefully this non-exhaustive list will be sufficient)
 */

if ("Hello".substr(0, 0) !== "") {
	throw 'Unreachable 1';
}

if (/^..$/.test('')) {
	throw 'Unreachable 2';
}

if (!/^..$/.test('ab')) {
	throw 'Unreachable 3';
}

if (!"ab".includes('a')) {
	throw 'Unreachable 4';
}

if ("ab".includes('c')) {
	throw 'Unreachable 5';
}

if (Math.round(5.5) != 6) {
	console.log(Math.round(5.5));
	throw 'Unreachable 6';
}

if (Math.round(5) != 5) {
	throw 'Unreachable 7';
}

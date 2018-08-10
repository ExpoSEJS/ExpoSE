var x = S$.symbol("X", '');
var regex = /^(.+)(.?)$/;

var b = x.match(regex);

if (b) {
	
	if (b[2] != '') {
		throw 'Unreachable';
	}

	if (b[1] == 'Hello world yanky doodle') {
		throw 'Reachable';
	}

	throw 'Reachable';
}
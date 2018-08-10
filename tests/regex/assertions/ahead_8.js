var x = S$.symbol("X", '');

var re = /^(?=([0-9])).$/;
var re2 = /^[0-9]$/;

var r = re.exec(x);

if (r) {
	
	if (!re2.test(r[0])) {
		throw 'Unreachable';
	}

	throw 'Reachable';
}
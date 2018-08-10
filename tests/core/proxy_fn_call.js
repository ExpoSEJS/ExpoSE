var S$ = require('S$');

function Hello() {
	console.log('Called Hello with ' + JSON.stringify(arguments));
	if (arguments[4] == 'a') {
		throw 'Reachable';
	}
}

Hello.apply(null, S$.symbol('X', []));
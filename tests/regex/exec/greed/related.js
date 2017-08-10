//In this test a string constraint is used to force a relation between two captured strings
//The Regex in question though places the implicit constraint that C2 can only ever be one character wide though

var x = symbolic X initial '';
var b = /^(.+)(.+)$/.exec(x);

if (b) {
	if (b[1] == b[2]) throw 'Reachable';
	throw 'Reachable';
}
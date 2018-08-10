var x = S$.symbol("X", '');
var b = /(a)(b)(c)/.exec(x);

if (b) {
	if (b[1] != 'a') throw 'Unreachable';
	if (b[2] != 'b') throw 'Unreachable';
	if (b[3] != 'c') throw 'Unreachable';

	if (x == 'helloabc') throw 'Reachable';
	if (x == 'abchello') throw 'Reachable';

	if (b[0] == "helloabc") throw 'Unreachable';
	if (b[0] == "abchello") throw 'Unreachable';

	throw 'Reachable';
}
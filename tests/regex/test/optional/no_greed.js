//Simple optional enumerates all strings possible from a simple optional
//Tests that ?? is the same as ? without captures (In test)

var x = symbolic X initial '';

if (/^a??b??c??$/.test(x)) {
	if (x == '') throw 'Reachable';
	if (x == 'a') throw 'Reachable';
	if (x == 'b') throw 'Reachable';
	if (x == 'c') throw 'Reachable';
	if (x == 'ab') throw 'Reachable';
	if (x == 'ac') throw 'Reachable';
	if (x == 'bc') throw 'Reachable';
	if (x == 'abc') throw 'Reachable';
	throw 'Unreachable';
}

//Test that braced terms resolve properly, /abc?/ is ab (optional c), (abc) is '' or abc
if (/^n(qrk)??$/.test(x)) {
	if (x == 'n') throw 'Reachable';
	if (x == 'nqrk') throw 'Reachable';
	throw 'Unreachable';
}

if (/^zed??$/.test(x)) {
	if (x == 'ze') throw 'Reachable';
	if (x == 'zed') throw 'Reachable';
	throw 'Unreachable';
}

throw 'Reachable';
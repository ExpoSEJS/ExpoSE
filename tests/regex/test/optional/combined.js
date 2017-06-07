//Combine optional, non-greedy optional and non optional terms in the same regex and test

var x = symbolic X initial '';

if (/^a?bcd(bcde)??$/.test(x)) {
	if (x == 'bcd') throw 'Reachable';
	if (x == 'abcd') throw 'Reachable';
	if (x == 'bcdbcde') throw 'Reachable';
	if (x == 'abcdbcde') throw 'Reachable';
	throw 'Unreachable';
}

if (/^qerf??ef?$/.test(x)) {
	if (x == 'qere') throw 'Reachable';
	if (x == 'qerfe') throw 'Reachable';
	if (x == 'qeref') throw 'Reachable';
	if (x == 'qerfef') throw 'Reachable';
	throw 'Unreachable';
}

throw 'Reachable';
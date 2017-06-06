//Simple alternation test

var x = symbolic X initial '';

if (/^(a|b|hello|dog)$/.test(x)) {
	if (x == 'a') throw 'Reachable';
	if (x == 'b') throw 'Reachable';
	if (x == 'hello') throw 'Reachable';
	if (x == 'dog') throw 'Reachable';
	throw 'Unreachable';
}
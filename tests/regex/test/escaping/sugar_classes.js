var x = symbolic X initial '';

if (/^\d$/.test(x)) {
	var is_digit = (x == '0' || x == '1' || x == '2' || x == '3' || x == '4' || x == '5' || x == '6' || x == '7' || x == '8' || x == '9');
	if (!is_digit) throw 'Unreachable';
	throw 'Reachable';
}

if (/^\D$/.test(x)) {
	var is_digit = (x == '0' || x == '1' || x == '2' || x == '3' || x == '4' || x == '5' || x == '6' || x == '7' || x == '8' || x == '9');
	if (is_digit) throw 'Unreachable';
	throw 'Reachable';
}

if (/^\w$/.test(x)) {
	if (/^\s$/.test(x)) throw 'Unreachable';
	if (/^\d$/.test(x)) throw 'Reachable';
	if (/^\D$/.test(x)) throw 'Reachable';
	if (/^[a-z]$/.test(x)) throw 'Reachable';
	if (/^[A-Z]$/.test(x)) throw 'Reachable';
	if (x == '_') throw 'Reachable';
}

if (/^\W$/.test(x)) {
	if (/^\s$/.test(x)) throw 'Reachable';
	if (/^\d$/.test(x)) throw 'Unreachable';
	if (/^\D$/.test(x)) throw 'Unreachable';
	if (/^[a-z]$/.test(x)) throw 'Unreachable';
	if (/^[A-Z]$/.test(x)) throw 'Unreachable';
	if (x == '_') throw 'Unreachable';
}
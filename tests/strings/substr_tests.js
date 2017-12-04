var x = symbolic X initial "hello";

assume x.length == 5;

if (x.substr(1, 1) == "w") {
	throw 'Reachable';
}

if (x.substr(1) == "what") {
	throw 'Unreachable';
}

if (x.substr(1) == "phat") {
	throw 'Reachable 2';
}

if (x.substr(-1) == "w") {
	throw 'Reachable 3';
}

if (x.substr(-5, 3) == "por") {
	throw 'Reachable 4';
}

if (x.substr(-3, 8) == "por") {
	throw 'Reachable 5';
}

if (x.substr(-5, 4) == "por") {
	throw 'Unreachable';
}

if (x.substr(-1) == "what") {
	throw 'Unreachable';
}
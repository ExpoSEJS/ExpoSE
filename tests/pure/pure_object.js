var test = symbolic X initial {};

if (test.hello == 'what') {
	throw 'Reachable';
}

test.hello = 'what';

if (test.hello != 'what') {
	throw 'Unreachable';
}
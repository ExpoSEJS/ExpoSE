var x = symbolic X initial '';

var re1 = /^a(?=b)c$/;

if (re1.test(x)) {
	throw 'Unreachable';
}

var re2 = /^a(?=(a))a$/;
 
//Capture some text in an assertion
if (re2.test(x)) {
	var caps = re2.exec(x);

	if (caps[1] == 'a') {
		throw 'Reachable';
	} else {
		throw 'Unreachable';
	}
}

var re3 = /^b(?=b).$/;

if (re3.test(x)) {
	
	if (re3 != 'bb') {
		throw 'Unreachable';
	}

	throw 'Reachable';
}

throw 'Reachable';
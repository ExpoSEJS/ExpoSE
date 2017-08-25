var x = symbolic X initial '';

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

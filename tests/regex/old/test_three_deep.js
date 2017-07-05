var x = symbolic X initial '';

//The lack of anchors ^ and $ means that this program can throw errors 
if (/a|b|c/.test(x)) {
	if (/a/.test(x)) {
		assert !/c/.test(x);
		assert !/b/.test(x);
	}

	if (/b/.test(x)) {
		assert !/a/.test(x);
		assert !/c/.test(x);
	}

	if (/c/.test(x)) {
		assert !/a/.test(x);
		assert !/b/.test(x);
	}
}
var x = S$.symbol("X", '');

//The lack of anchors ^ and $ means that this program can throw errors 
if (/a|b|c/.test(x)) {
	if (/a/.test(x)) {
		S$.assert(!/c/.test(x));
		S$.assert(!/b/.test(x));
	}

	if (/b/.test(x)) {
		S$.assert(!/a/.test(x));
		S$.assert(!/c/.test(x));
	}

	if (/c/.test(x)) {
		S$.assert(!/a/.test(x));
		S$.assert(!/b/.test(x));
	}
}
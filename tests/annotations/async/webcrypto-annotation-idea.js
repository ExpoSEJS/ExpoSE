var S$ = require('S$');
var _A = new (S$.SecAnn("A"))([]);

var encrypt = function(msg, key) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
    		resolve('ciphertext: ' + msg + key);
  		}, 300);
	}); 
}

var encWrapper = function(msg, key) {
	//do the underlying API call
	var res = encrypt(msg, key);
	//once finished, do the annotation and return it back
	res = res.then(function(value) {
		return S$.annotate(value, _A);
	});
	//return annotated copy
	return res;
}

encWrapper('hi', 'key').then(function(value) {
	console.log(value);
	console.log(S$.annotations(value));
	console.log('done')
});
var x = symbolic X initial '';
var b = /.*(a)/.exec(x);

if (b) {
	assert b[0] == 'a'; //can be false
	assert b[1] == 'a'; //can't be false
}
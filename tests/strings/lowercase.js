//to lowercase smoke test
//Does not exhaustively test, just our weak model

var x = symbolic X initial '';

if (x.toLowerCase() == 'what_is_my_name') {
	throw 'Reachable';
}
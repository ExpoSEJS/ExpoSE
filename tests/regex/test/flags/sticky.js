//Test that multiline changes ^ into (\n or ^) and $ into (\n or $)
var x = symbolic X initial '';
var re = /abc/y;

x.length < 4;

if (re.test(x)) {
	
	if (re.test(x)) {
		//Length < 4, sticky is set, lastIndex should be 3, cant match again
		throw 'Unreachable';
	}

	throw 'Reachable';
}

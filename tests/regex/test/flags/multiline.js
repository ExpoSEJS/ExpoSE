//Test that multiline changes ^ into (\n or ^) and $ into (\n or $)
var x = symbolic X initial '';

if (/^abc$/m.test(x)) {
	if (x == 'helloabc') throw 'Unreachable';
	if (x == 'hello\nabc') throw 'Reachable';
	if (x == 'hello\nabc\nworld') throw 'Reachable';
	throw 'Reachable';
}

var x = symbolic X initial '';

if (/^(hello)+(world)+$/.test(x)) {
	x == '' && throw 'Unreachable';
	assert x == 'hellohelloworld';
}
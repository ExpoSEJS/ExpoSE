var x = symbolic X initial '';

if (/(hello)*(world)*/.test(x)) {
	assert x != '';
	assert x != 'hellohelloworld';
}
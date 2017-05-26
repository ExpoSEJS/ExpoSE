var x = symbolic X initial '';

if (/^he*llo_world*$/.test(x)) {
	assert x != 'heello_worlddddd';
	assert x != '';
}
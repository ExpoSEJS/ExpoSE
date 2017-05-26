var x = symbolic X initial '';

if (/^he+l+l+o_wor+l+d+$/.test(x)) {
	assert x != 'hellllllllloooooooooo_wooooorld';
	assert x != 'hellllloooooooooworld';
}
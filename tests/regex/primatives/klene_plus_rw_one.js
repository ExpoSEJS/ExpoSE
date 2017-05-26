var x = symbolic X initial '';

if (/^git(?:@|:\/\/)github\.com(?::|\/)([^\/]+\/[^\/]+)\.git$/.test(x)) {
	assert x.length > 0;
	assert x.indexOf('git') == -1;
}
var x = S$.symbol("X", '');

if (/^git(?:@|:\/\/)github\.com(?::|\/)([^\/]+\/[^\/]+)\.git$/.test(x)) {
	if (x.length > 0) throw 'Reachable';
	if (x.length == 0) throw 'Unreachable';
	if (x.indexOf('git') == -1) throw 'Unreachable';
	if (x.indexOf('@') == -1) throw 'Reachable';
}
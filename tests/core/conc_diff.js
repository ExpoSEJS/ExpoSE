var x = symbolic X initial 5;
var y = symbolic Y initial false;

if (x == 0) {} //Force x to false at least once

if (x == y) {
	console.log('Here');
}
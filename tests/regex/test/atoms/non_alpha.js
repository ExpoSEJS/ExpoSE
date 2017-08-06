var x = symbolic X initial '';
var isIn = /void helloWorld\(\) \{\{\}\} DOGDOGDOG console.log\(HELLO WORLD\) HOW ARE YOU/.test(x);

if (isIn) {
	throw 'Reachable';
} else {
	throw 'Unreachable';
}
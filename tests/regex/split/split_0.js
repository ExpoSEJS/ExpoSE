var S$ = require("S$");

var x = S$.symbol("A", "a");
S$.assume(x.length == 2);
var k = x.split(/e/);

if (k[0] == "j") {
  throw "Reachable";
}

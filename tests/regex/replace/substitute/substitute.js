var S$ = require("S$");

var a = S$.symbol("A", "");

var x = a.replace(/(.*)/, "$1$1");

if (x != a + a) {
  //Reachable when x == "\n"
  if (a.length != 0) {
    throw "Reachable 1";
  }

  throw "Unreachable";
} else {
  throw "Reachable 2";
}

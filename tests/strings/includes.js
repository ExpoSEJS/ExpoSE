var S$ = require("S$");

var t = S$.symbol("X", "");

if (t.includes("What")) {
  throw "Reachable 1";
}

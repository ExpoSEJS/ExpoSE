var S$ = require("S$");

if (/^\D$/.test(S$.symbol("A", ""))) {
  throw "Reachable";
}

const S$ = require("S$");
const r = S$.symbol("A", 5);

if (r == 10) {
  throw "Waah";
}

var S$ = require("S$");
var x = S$.symbol("A", "");

x.replace(/^.+(.).+/, function (zero, one) {
  if (one == "p") {
    throw "Reachable 1";
  } else if (one == "c") {
    throw "Reachable 2";
  } else if (one == "dog") {
    throw "Unreachable";
  }
});

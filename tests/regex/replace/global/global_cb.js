var S$ = require("S$");

x = S$.symbol("X", "");

S$.assume(x.length <= 10);

var y = x.replace(/He(l)lo/g, function (zero, one) {
  return one;
});

if (y == "l") {
  throw "Reachable 1";
} else if (y == "ll") {
  throw "Reachable 2";
}

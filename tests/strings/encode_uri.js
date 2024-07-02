var S$ = require("S$");

var target = S$.symbol("Target", "");

S$.assume(target.length < 5);

if (target == "$$££") {
}

var result = encodeURI(target);

if (result == "cows r cool") {
  throw "Hi";
}

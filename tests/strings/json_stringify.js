var S$ = require("S$");

console.log("Constructing the new object");

var pp = {
  a: S$.symbol("A", ""),
};

console.log("About to stringify");

var rqr = JSON.stringify(pp);

console.log("Done stringify");

if (rqr.includes("Wow")) {
  throw "This really works?";
}

console.log("Result below");
console.log(rqr);

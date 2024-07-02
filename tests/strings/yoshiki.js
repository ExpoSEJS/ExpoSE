var S$ = require("S$");
var x = S$.symbol("X", "2");

S$.assume(x.indexOf("=") === -1);

var url = "https://experiment.com?z=" + x;

console.log(url, url.indexOf("?"));

S$.assume(url.indexOf("?") > 0);

const hashes = url.slice(url.indexOf("?") + 1).split("&");
const params = {};

hashes.map((hash) => {
  const [key, val] = hash.split("=");
  params[key] = decodeURIComponent(val);
});

if (params["z"] === "3") {
  throw "Hello Z3.";
}

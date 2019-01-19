var S$ = require('S$');

if (S$.symbol('A', '').lastIndexOf('Hello') == 5) {
  throw 'Reachable';
}

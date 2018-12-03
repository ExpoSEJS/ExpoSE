var S$ = require('S$');
var a = S$.symbol('A', '');

S$.assume(a.length == 'iPhoneAndroid'.length);

if (a == 'iPhoneAndroid') {
   throw 'iPhone Android'; 
}

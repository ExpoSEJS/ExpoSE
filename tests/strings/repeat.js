var S$ = require('S$');
var x = S$.symbol("X", '');

if (x.repeat(5) == "AAAAA") {

    if (x.repeat(4) != "AAAA") {
        throw 'Unreachable 1';
    }

    throw 'Reachable 1';
}

if (x.repeat(5) == "AAAA") {
    throw 'Unreachable 2';
}

if (x.repeat(0) != "") {
    throw 'Unreachable 3';
}

if (x.repeat(10).length == 20) {
    throw 'Reachable 2';
}

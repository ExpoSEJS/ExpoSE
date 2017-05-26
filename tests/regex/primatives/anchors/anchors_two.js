'use strict';

var q = symbolic q initial '';

if (/--.+=/.test(q)) {
    assert q[0] == '-'; //Reachable failure
    assert q[q.length - 1] = '='; //Reachable failure
}

console.log('Path Finished');
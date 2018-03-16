var q = symbolic X initial [1];
var qq = symbolic X initial 5;

if (q.length == 5) {
    q[3] = qq;

    if (q[3] != qq) {
        throw 'Unreachable';
    }

    throw 'Reached';
}

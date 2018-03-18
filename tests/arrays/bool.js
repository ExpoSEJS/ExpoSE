var x = symbolic X initial [false];

if (x.includes(true)) {

    if (x[4]) {
        throw 'Reachable';
    }

} else {
    if (x[4]) {
        throw 'Unreachable';
    }

    if (!x[4]) {
        throw 'Reachable';
    }
}

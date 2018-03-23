var x = symbolic X initial 5;

if (Math.floor(x) == 6) {
    throw 'Reachable';
}

if (Math.ceil(x) == 9) {
    throw 'Reachable';
}

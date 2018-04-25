var x = symbolic X initial '';

assume x.length == 15;

if (x.trim() == 'Hello') {
    throw 'Reachable';
}

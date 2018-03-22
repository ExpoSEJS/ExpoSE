var x = [1, 2, 3];

if (x.length != 3) {
    throw 'Unreachable';
}

if (x.pop() != 3) {
    throw 'Unreachable';
}

if (x.length != 2) {
    throw 'Unreachable';
}


var x = [1, 2, 3];

if (x.length != 3) {
    throw 'Unreachable';
}

x.push(4);

if (x.length != 4) {
    throw 'Unreachable';
}

if (x[0] != 1) { throw 'Unreachable'; }
if (x[1] != 2) { throw 'Unreachable'; }
if (x[2] != 3) { throw 'Unreachable'; }
if (x[3] != 4) { throw 'Unreachable'; }

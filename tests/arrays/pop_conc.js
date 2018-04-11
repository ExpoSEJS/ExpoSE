var x = [1, 2, 3];

console.log('X is ' + x + ' and JSONd ' + JSON.stringify(x));

if (x.length != 3) {
    throw 'Unreachable 1';
}

if (x.pop() != 3) {
    throw 'Unreachable 2';
}

if (x.length != 2) {
    throw 'Unreachable 3';
}


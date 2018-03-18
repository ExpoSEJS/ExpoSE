var x = symbolic X initial ['Hi'];

if (x.indexOf('What') != -1) {

    if (!x.includes('What')) {
        throw 'Unreachable';
    }

    throw 'Reachable';
}

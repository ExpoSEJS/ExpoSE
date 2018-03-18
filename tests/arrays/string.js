var stdargs = symbolic X initial ['P'];

if (stdargs[3] == 'Hello') {

    if (!stdargs.includes('Hello')) {
        throw 'Unreachable';
    }

    throw 'Reachable'; 
}

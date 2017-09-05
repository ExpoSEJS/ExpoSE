var x = {
    a: 'hi',
    b: 'bob',
    c: 'john'
}

var a = x[symbolic X initial ''];

if (a && a == 'john') {
    console.log('I SHOULD BE REACHABLE!!')
    throw 'Reachable';
}
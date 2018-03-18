var x = {};

x[4] = 'Hi';

x['Hello'] = 32;

x[false] = true;

assert x[false] == true;
assert x['Hello'] = 32;
assert x[4] == 'Hi';

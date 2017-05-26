/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

'use strict';

var q = symbolic q initial '';

//Implict anchor => /--.+=.*?/ (will let anything in after the =)
if (/^--.+=/.test(q)) {
    assert q[0] == '-'; //Not reachable failure
    assert q[q.length - 1] = '='; //Reachable failure
}

console.log('Path Finished');
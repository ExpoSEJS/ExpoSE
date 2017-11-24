/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import FunctionSignatures from './FunctionSignatures';
import Statements from './Statements';
import Expression from './Expression';

export default function(acorn, doInjection) {
    acorn.plugins.tropigate = function(instance, opts) {
        FunctionSignatures(acorn, doInjection, instance, opts);
        Statements(acorn, doInjection, instance, opts);
        Expression(acorn, doInjection, instance, opts);
    }
};

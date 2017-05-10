/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Log from './Utilities/Log';

export default {
    evalBinary: function(op, left, right) {
        switch (op) {
            case "==":
                return (left == right);
            case "===":
                return (left === right);
            case "!=":
                return (left != right);
            case "!==":
                return (left !== right);

            case "<":
                return (left < right);
            case ">":
                return (left > right);
            case "<=":
                return (left <= right);
            case ">=":
                return (left >= right);

            case "+":
                return (left + right);
            case "-":
                return (left - right);
            case "*":
                return (left * right);
            case "/":
                return (left / right);
            case "%":
                return (left % right);

            case ">>":
                return (left >> right);
            case "<<":
                return (left << right);
            case ">>>":
                return (left >>> right);

            case "&&":
                return (left && right);
            case "||":
                return (left || right);
            case "&":
                return (left & right);
            case "|":
                return (left | right);
            case "^":
                return (left ^ right);

            case "instanceof":
                return (left instanceof right);
            case "in":
                return (left in right);

            default:
                Log.log("Unsupported binary operator " + op + " for concrete evaluation.");
                return undefined;
        }
    },

    evalUnary: function(op, left) {
        switch (op) {
            case "!":
                return !left;
            case "~":
                return ~left;
            case "-":
                return -left;
            case "+":
                return +left;
            case "typeof":
                return typeof left;
            default:
                Log.log("Unsupported unary operator " + op + " for concrete evaluation.");
                return undefined;
        }
    }
};

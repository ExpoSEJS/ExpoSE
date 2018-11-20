/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

const BinaryJumpTable = {
  "==": function(left, right) { return left == right; },
  "===": function(left, right) { return left === right; },

  "!=": function(left, right) { return left != right; },
  "!==": function(left, right) { return left !== right; },

  "<": function(left, right) { return left < right; },
  ">": function(left, right) { return left > right; },

  "<=": function(left, right) { return left <= right; },
  ">=": function(left, right) { return left >= right; },
    
  "+": function(left, right) { return left + right; },
  "-": function(left, right) { return left - right; },

  "*": function(left, right) { return left * right; },
  "/": function(left, right) { return left / right; },

  "%": function(left, right) { return left % right; },
    
  ">>": function(left, right) { return left >> right; },
  "<<": function(left, right) { return left << right; },
  ">>>": function(left, right) { return left >>> right; },

  "&": function(left, right) { return left & right; },
  "&&": function(left, right) { return left && right; },

  "|": function(l, r) { return l | r; },
  "||": function(l, r) { return l || r; },

  "^": function(l, r) { return l ^ r; },
  "instanceof": function(l, r) { return l instanceof r; },
  "in": function(l, r) { return l in r; }
};

const UnaryJumpTable = {
  "!": function(v) { return !v; },
  "~": function(v) { return ~v; },
  "-": function(v) { return -v; },
  "+": function(v) { return +v; },
  "typeof": function(v) { return typeof v; }
};

export default {
  evalBinary: function(op, left, right) {
    return BinaryJumpTable[op](left, right);
  },

  evalUnary: function(op, left) {
    return UnaryJumpTable[op](left);
  }
};

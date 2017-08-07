/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

export default {
	makeIdent(name) {
		let node = this.startNode();
		node.name = name;
		return this.finishNode(node, 'Identifier');
	},
	wrapStatement(expr) {
        let node = this.startNode();
        node.expression = expr;
        return this.finishNode(node, 'ExpressionStatement');
    }
}

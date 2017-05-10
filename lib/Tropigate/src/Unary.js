/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Utils from './Utils';
import Generator from './Generator';
import InjectHelper from './InjectHelper';
import TypeParser from './TypeParser';

function BuildTraitWrapper(doInjection, tt, expr, callback) {
    this.next();

    let annotation = TypeParser.parseTypeAnnotation.call(this, tt, false);

    //Replace EXPR with assume if Injection
    if (doInjection) {
        expr = callback.call(this, expr, annotation);
    }

    return expr;
}

export default function(acorn, doInjection, instance, opts) {
    let tt = acorn.tokTypes;

    //TODO: Push upstream change to acorn so I dont have to replace alllll of this crazyness
    function ParseMaybeUnary(inner) {
        return function(refDestructuringErrors, sawUnary) {

            let startPos = this.start,
                startLoc = this.startLoc,
                expr;

            if (this.inAsync && this.isContextual("await")) {
                expr = this.parseAwait(refDestructuringErrors)
                sawUnary = true
            } else if (this.type.prefix) {
                let node = this.startNode(),
                    update = this.type === tt.incDec
                node.operator = this.value
                node.prefix = true
                this.next()
                node.argument = this.parseMaybeUnary(refDestructuringErrors, true)
                this.checkExpressionErrors(refDestructuringErrors, true)
                if (update) this.checkLVal(node.argument)
                else if (this.strict && node.operator === "delete" &&
                    node.argument.type === "Identifier")
                    this.raiseRecoverable(node.start, "Deleting local variable in strict mode")
                else sawUnary = true
                expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression")
            } else {
                expr = this.parseExprSubscripts(refDestructuringErrors)
                if (this.checkExpressionErrors(refDestructuringErrors)) return expr
                while (this.type.postfix && !this.canInsertSemicolon()) {
                    if (this.type == tt.as) {
                        expr = BuildTraitWrapper.call(this, doInjection, tt, expr, Generator.genAs);
                    } else if (this.type == tt.drop) {
                        expr = BuildTraitWrapper.call(this, doInjectation, tt, expr, Generator.genDrop);
                    } else if (this._canParseIs && this.type == tt.is) {
                        expr = BuildTraitWrapper.call(this, doInjection, tt, expr, Generator.genTest);
                    } else {
                        let node = this.startNodeAt(startPos, startLoc)
                        node.operator = this.value
                        node.prefix = false
                        node.argument = expr
                        this.checkLVal(expr)
                        this.next()
                        expr = this.finishNode(node, "UpdateExpression")
                    }
                }
            }

            if (!sawUnary && this.eat(tt.starstar))
                return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(refDestructuringErrors, false), "**", false)
            else
                return expr
        };
    }

    instance.extend('parseMaybeUnary', ParseMaybeUnary);
}

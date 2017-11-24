/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Utils from './Utils';
import Generator from './Generator';

export default function(acorn, doInjection, instance, opts) {
    let tt = acorn.tokTypes;

    function ParseAssert() {
        this._canParseIs = true;
        let result = Utils.wrapStatement.call(this, Generator.genAssert.call(this, this.parseExpression(false, {})));
        this._canParseIs = false;

        this.semicolon();

        if (doInjection) {
            return result;
        } else {
            return this.finishNode(this.startNode(), "EmptyStatement");
        }
    }

    function ParseAssume() {
        let assumption = this.parseExpression(false, {});
        let result = Utils.wrapStatement.call(this, Generator.genAssumeTrue.call(this, assumption));

        this.semicolon();

        if (doInjection) {
            return result;
        } else {
            return this.finishNode(this.startNode(), "EmptyStatement");
        }
    }

    function ParseStatement(inner) {
        return function(declaration, topLevel, exports) {
            if (this.eatContextual("assert")) {
                return ParseAssert.call(this);
            } else if (this.eatContextual("assume")) {
                return ParseAssume.call(this);
            } else {
                return inner.call(this, declaration, topLevel, exports);
            }
        }
    }

    instance.extend('parseStatement', ParseStatement);
}

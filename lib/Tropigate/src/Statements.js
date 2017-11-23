/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Utils from './Utils';
import Generator from './Generator';
import InjectHelper from './InjectHelper';
import TypeParser from './TypeParser';

export default function(acorn, doInjection, instance, opts) {
    let tt = acorn.tokTypes;

    function ParseTraitDependants() {
        let names = [];

        do {
            names.push(this.parseIdent());
        } while (this.eat(tt.comma));

        this.expect(tt.parenR);

        return names;
    }

    function ParseTraitParams() {
        let dvals = [];

        if (this.eat(tt.parenL)) {
            dvals = ParseTraitDependants.call(this);
        }

        return dvals;
    }

    function ParseTraitDef() {
        let name = this.parseIdent();
        let dvals = ParseTraitParams.call(this);
        let extender;

        if (this.eat(tt._extends)) {
            extender = Generator.genTraitExpr.call(this, this.parseIdent());
        }

        this.semicolon();

        if (doInjection) {
            return Utils.wrapStatement.call(this, Generator.genTraitDef.call(this, name, dvals, extender));
        } else {
            return this.finishNode(this.startNode(), "EmptyStatement");
        }
    }

    function ParseTraitRule() {
        let traitPath = this.parseExpression(false, {});
        let toOverride = this.parseIdent();
        let fnOveride = this.startNode();
        this.parseFunction(fnOveride, false);
        this.semicolon();

        if (doInjection) {
            return Utils.wrapStatement.call(this, Generator.genTraitRule.call(this, traitPath, toOverride, fnOveride));
        } else {
            return this.finishNode(this.startNode(), "EmptyStatement");
        }
    }

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

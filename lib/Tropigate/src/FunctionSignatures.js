/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Utils from './Utils';
import Generator from './Generator';

export default function(acorn, doInjection, instance, opts) {
	let tt = acorn.tokTypes;

    function ParseFunctionParams(inner) {
        return function(node) {
            inner.call(this, node);

            if (this.eat(tt.where)) {
                this._canParseIs = true;
                node.whereClause = this.parseExpression(false, {});
                this._canParseIs = false;
            }
        }
    }

    function ParseBindingAtom(inner) {
        return function(refDestructuringErrors) {
            if (this.type == tt.name) {
                let ident = this.parseIdent();
                return ident;
            } else {
                return inner.call(this, refDestructuringErrors);
            }
        }
    }

    instance.extend('parseFunctionParams', ParseFunctionParams);
    instance.extend('parseBindingAtom', ParseBindingAtom);
}

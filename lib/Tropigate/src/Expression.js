/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Utils from './Utils';
import Generator from './Generator';
import InjectHelper from './InjectHelper';
import TypeParser from './TypeParser';

export default function(acorn, doInjection, instance, opts) {
	let tt = acorn.tokTypes;

    function ParseExprAtom(inner) {
        return function(refDestructuringErrors) {
            if (this.eat(tt.symbolic)) {
                let name = this.parseIdent();
                let exprFollows = undefined;

                if (this.eatContextual('initial')) {
                    exprFollows = this.parseMaybeConditional(true, refDestructuringErrors);
                }

                if (doInjection) {
                    return exprFollows ? Generator.genSymbol.call(this, name, exprFollows) : Generator.genPureSymbol.call(this, name);
                } else {
                    return exprFollows;
                }
            } else {
                return inner.call(this, refDestructuringErrors);
            }
        }
    }

    instance.extend('parseExprAtom', ParseExprAtom);
}

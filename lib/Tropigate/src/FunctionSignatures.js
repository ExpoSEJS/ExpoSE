/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Utils from './Utils';
import Generator from './Generator';
import InjectHelper from './InjectHelper';
import TypeParser from './TypeParser';

export default function(acorn, doInjection, instance, opts) {
	let tt = acorn.tokTypes;

    function ParseFunctionBody(inner) {
        return function(node, isArrowFunction) {
            let parsed = inner.call(this, node, isArrowFunction);
            if (doInjection) {
                InjectHelper.injectExpectations.call(this, node);
            }
            return parsed;
        };
    }

    function ParseFunctionParams(inner) {
        return function(node) {
            inner.call(this, node);

            if (this.eat(tt.typeAnnotation)) {
                node.returnType = TypeParser.parseTypeAnnotation.call(this, tt, true);
            }

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

                if (this.eat(tt.typeAnnotation)) {
                    ident.expectedType = TypeParser.parseTypeAnnotation.call(this, tt, true);
                }

                return ident;
            } else {
                return inner.call(this, refDestructuringErrors);
            }
        }
    }

    instance.extend('parseFunctionParams', ParseFunctionParams);
    instance.extend('parseFunctionBody', ParseFunctionBody);
    instance.extend('parseBindingAtom', ParseBindingAtom);
}

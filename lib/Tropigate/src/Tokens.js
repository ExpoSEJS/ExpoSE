/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

export default function(acorn, inject, instance, opts) {
    let tt = acorn.tokTypes;
    let tc = acorn.tokContexts;

    tt.typeAnnotation = tt.colon;
    tt.startTrait = new acorn.TokenType("<!", {});
    tt.endTrait = new acorn.TokenType("!>", {});

    // Succinct definitions of keyword token types
    function kw(name, options = {}) {
        options.keyword = name
        return new acorn.TokenType(name, options)
    }

    function binop(name, kw, prec) {
        let options = {
            beforeExpr: false,
            binop: prec,
            keyword: kw
        };
        return new acorn.TokenType(name, options);
    }

    tt.assert = kw('assert');
    tt.assume = kw('assume');
    tt.where = kw('where');
    tt.traitdef = kw('traitdef');
    tt.traitrule = kw('traitrule');

    tt.symbolic = new acorn.TokenType("symbolic", {
        startsExpr: true
    });

    tt.ptrait = kw('ptrait');

    tt.is = new acorn.TokenType("is", {
        postfix: true,
        startsExpr: true
    });

    tt.drop = new acorn.TokenType("drop", {
        postfix: true,
        startsExpr: true
    });

    tt.as = new acorn.TokenType("as", {
        postfix: true,
        startsExpr: true
    });

    function ReadToken(inner) {
        return function(code) {

            if (this.input.slice(this.pos, this.pos + 7) === 'assert ') {
                this.pos += 7;
                return this.finishToken(tt.assert);
            }

            if (this.input.slice(this.pos, this.pos + 7) === 'assume ') {
                this.pos += 7;
                return this.finishToken(tt.assume);
            }

            if (this.input.slice(this.pos, this.pos + 5) === 'drop!! ') {
                this.pos += 5;
                return this.finishToken(tt.drop);
            }

            if (this.input.slice(this.pos, this.pos + 6) === 'where!! ') {
                this.pos += 6;
                return this.finishToken(tt.where);
            }

            if (this.input.slice(this.pos, this.pos + 9) === 'symbolic ') {
                this.pos += 9;
                return this.finishToken(tt.symbolic);
            }

            if (this.input.slice(this.pos, this.pos + 9) === 'traitdef ') {
                this.pos += 9;
                return this.finishToken(tt.traitdef);
            }

            if (this.input.slice(this.pos, this.pos + 10) === 'traitrule ') {
                this.pos += 10;
                return this.finishToken(tt.traitrule);
            }

            if (this.input.slice(this.pos, this.pos + 7) === 'ptrait ') {
                this.pos += 7;
                return this.finishToken(tt.ptrait);
            }

            if (this.input.slice(this.pos, this.pos + 3) == 'is ') {
                this.pos += 2;
                return this.finishToken(tt.is);
            }

            if (this.input.slice(this.pos, this.pos + 3) == 'as ') {
                this.pos += 2;
                return this.finishToken(tt.as);
            }

            if (this.input.slice(this.pos, this.pos + 2) == '<!') {
                this.pos += 2;
                return this.finishToken(tt.startTrait);
            }

            if (this.input.slice(this.pos, this.pos + 2) == '!>') {
                this.pos += 2;
                return this.finishToken(tt.endTrait);
            }

            return inner.call(this, code);
        }
    }

    instance.extend('readToken', ReadToken);

    return tt;
}

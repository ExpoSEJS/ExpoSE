/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Utils from './Utils';

let escodegen = require('escodegen');

const SecretRetTemp = '__secret_ret_addr_';

function Member(ident, name, identIsExpr, nameIsExpr) {
    let S$ = this.startNode()
    S$.object = identIsExpr ? ident : Utils.makeIdent.call(this, ident);
    S$.property = nameIsExpr ? name : Utils.makeIdent.call(this, name);
    S$.computed = false;
    return this.finishNode(S$, "MemberExpression");
}

function Call(e, argz) {
    let call = this.startNode();
    call.callee = e;
    call.arguments = argz;
    return this.finishNode(call, "CallExpression");
}

function MakeS$(name) {
    const storing_obj = 'Object';
    const s$id = '_s$_';
    let S$ = this.startNode()
    S$.object = Utils.makeIdent.call(this, storing_obj);
    S$.property = Utils.makeIdent.call(this, s$id);
    S$.computed = false;
    return Member.call(this, this.finishNode(S$, "MemberExpression"), name, true);
}

function StoreAs(vname, expr) {
    let outer = this.startNode();
    outer.kind = 'var';

    let decl = this.startNode();
    decl.id = vname;
    decl.init = expr;
    decl = this.finishNode(decl, "VariableDeclarator");

    outer.declarations = [decl];
    return this.finishNode(outer, "VariableDeclaration");
}

function ToLiteral(ident) {
    let node = this.startNode();
    node.value = ident.name;
    node.raw = ident.name;
    return this.finishNode(node, "Literal");
}

function GenAssert(expr, assertText, assertIsExpr) {

    if (!assertIsExpr) {
        //Generate flavor text for assert by stringifying expression
        assertText = (assertText || (escodegen.generate(expr) + " failed assertion"));
        assertText = Utils.makeIdent.call(this, assertText);
        assertText = ToLiteral.call(this, assertText);
    }

    let S$ = MakeS$.call(this, 'assert');

    //TODO: Use the Expr itself to generate the assertion name
    let call = this.startNode();
    call.callee = S$;
    call.arguments = [expr, assertText];
    return this.finishNode(call, "CallExpression");
}

function Add(val1, val2) {
    let node = this.startNode();
    node.left = val1;
    node.right = val2;
    node.operator = "+";
    return this.finishNode(node, "BinaryExpression");
}

function GetRider(val) {
    return Call.call(this, Member.call(this, SName, 'getRider'), [val]);
}

export default {
    genSymbol(name, expr) {
        const SymbolFn = 'symbol';
        let node = this.startNode();
        node.callee = MakeS$.call(this, SymbolFn);
        node.arguments = [ToLiteral.call(this, name), expr];
        return this.finishNode(node, 'CallExpression');
    },
    genPureSymbol(name) {
        const PureSymbolFn = 'pureSymbol';
        let node = this.startNode();
        node.callee = MakeS$.call(this, PureSymbolFn);
        node.arguments = [ToLiteral.call(this, name)];
        return this.finishNode(node, 'CallExpression');
    },
    genAssumeTrue(expr) {
        let S$ = MakeS$.call(this, 'assume');
        return Call.call(this, S$, [expr]);
    },
    genAssert: GenAssert
}

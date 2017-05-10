/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Utils from './Utils';

let escodegen = require('escodegen');

const SName = '__secret__S$';
const STName = '__secret__traits__';
const SymbolFn = 'symbol';
const PureSymbolFn = 'pureSymbol';
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
    let S$ = this.startNode()
    S$.object = Utils.makeIdent.call(this, SName);
    S$.property = Utils.makeIdent.call(this, name);
    S$.computed = false;
    return this.finishNode(S$, "MemberExpression");
}

/**
 * Stores in __secret__traits__ the given value
 */
function StoreInST(vname, expr) {
    let node = this.startNode();
    node.operator = '=';
    node.left = Member.call(this, STName, vname, false, true);
    node.right = expr;
    return this.finishNode(node, "AssignmentExpression");
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

function Require(vname, name) {
    let call = this.startNode();
    call.callee = Utils.makeIdent.call(this, 'require');
    call.arguments = [Utils.makeIdent.call(this, name)];
    call = this.finishNode(call, "CallExpression");

    return StoreAs.call(this, Utils.makeIdent.call(this, vname), call);
}

function WrapT(args) {
    let S$ = this.startNode()
    S$.object = Utils.makeIdent.call(this, SName);
    S$.property = Utils.makeIdent.call(this, 't');
    S$.computed = false;
    S$ = this.finishNode(S$, "MemberExpression");

    let call = this.startNode();
    call.callee = S$;
    call.arguments = args;
    call = this.finishNode(call, "CallExpression");

    return call;
}

function GenPArgs(trait) {
    let node = this.startNode();
    node.elements = trait.parameters.map(item => item.ptrait ? item.ptrait : GenTrait.call(this, item));
    return this.finishNode(node, 'ArrayExpression');
}

function GenTrait(trait) {
    //If the source code marked an expression as a trait (For annotations referencing their own bound traits)
    //TODO: Needing to do an if ptrait check twice is ugly
    if (trait.ptrait) {
        return [trait.ptrait];
    }

    let args = [trait, GenPArgs.call(this, trait)].concat(trait.dependants);

    return WrapT.call(this, args);
}

function ToLiteral(ident) {
    let node = this.startNode();
    node.value = ident.name;
    node.raw = ident.name;
    return this.finishNode(node, "Literal");
}

function WrapArray(items) {
    let node = this.startNode();
    node.elements = items;
    return this.finishNode(node, 'ArrayExpression');
}

function WrapIdentList(list) {
    return WrapArray.call(this, list.map(x => ToLiteral.call(this, x)));
}

function AndExprs(expr1, expr2) {

    if (expr1.value === true) {
        return expr2;
    }

    let node = this.startNode();
    node.left = expr1;
    node.operator = "&&";
    node.right = expr2;
    return this.finishNode(node, "LogicalExpression");
}

function MkLiteral(val) {
    var node = this.startNode();
    node.value = val;
    node.raw = '' + val;
    return this.finishNode(node, "Literal");
}

function GetTop() {
    return Member.call(this, SName, 'Top');
}

function GenTopT(traitList) {
    return WrapT.call(this, [GetTop.call(this), WrapArray.call(this, traitList)]);
}

function GenerateTraitExprList(traitDefList) {
    return traitDefList.map(i => GenTrait.call(this, i));
}

/*
 * Generate S$.test(expr).is(trait)
 */
function GenTestAtom(expr, traitList) {
    return Call.call(this, Member.call(this, Call.call(this, MakeS$.call(this, 'test'), [expr]), 'is', true, false), [GenTopT.call(this, traitList)]);
}

/**
 * GenTest generates type tests in the form x instanceof T && S$.test(x).is(T1) && S$.test(x).is(T2);
 */
function GenTest(expr, type) {

    //type.base should be a typeof
    //type.annotations is a set of S$.test.ist
    let current = MkLiteral.call(this, true);

    if (type) {
        //TODO: Test base type
        //TODO: All of these ands can be replaced by a single TopType subtype expr
        current = AndExprs.call(this, current, GenTestAtom.call(this, expr, GenerateTraitExprList.call(this, type.annotations)));
    }

    return current;
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

function GenExpectationString(val, expected) {

    let result = MkLiteral.call(this, 'Expected ' + escodegen.generate(val) +'(');
    result = Add.call(this, result, GetRider.call(this, val));
    result = Add.call(this, result, MkLiteral.call(this, ') to satisfy '));

    if (expected.base) {
        result = Add.call(this, result, MkLiteral.call(this, expected.base));
    }

    //TODO: Replace this section with the generation of the top type and then use that's toString
    if (expected.annotations) {
        let tr_list = expected.annotations.map(i => GenTrait.call(this, i));
        let top_t = GenTopT.call(this, tr_list);
        result = Add.call(this, result, top_t);
    }

    return result;
}

function GenExpectation(val, expected) {
    //TODO: We dont generate useful trait assertion messages anymore
    return GenAssert.call(this, GenTest.call(this, val, expected), GenExpectationString.call(this, val, expected), true);
}

function RewriteReturn(returnStmt, retArg, returnType) {
    let storeArg = StoreAs.call(this, SecretRetTemp, retArg);
    let argument = Utils.makeIdent.call(this, SecretRetTemp);
    let expect = GenExpectation.call(this, argument, returnType);

    //Only modify argument if argument is undefined (To avoid weird code generation)
    //Example: return; would turn into return undefined; Correct but odd
    returnStmt.argument = returnStmt.argument ? argument : undefined;

    let blockReplace = this.startNode();
    blockReplace.body = [storeArg, expect, returnStmt];
    return this.finishNode(blockReplace, "BlockStatement");
}

function GenAs(expr, trait) {
    let S$ = this.startNode()
    S$.object = Utils.makeIdent.call(this, SName);
    S$.property = Utils.makeIdent.call(this, 'assume');
    S$.computed = false;
    S$ = this.finishNode(S$, "MemberExpression");

    let call = this.startNode();
    call.callee = S$;
    call.arguments = [expr];
    call = this.finishNode(call, "CallExpression");

    let is = this.startNode();
    is.object = call;
    is.property = Utils.makeIdent.call(this, 'is');
    is.computed = false;
    is = this.finishNode(is, "MemberExpression");

    let result = this.startNode();
    result.callee = is;
    result.arguments = [GenTopT.call(this, GenerateTraitExprList.call(this, trait.annotations))];
    return this.finishNode(result, 'CallExpression');
}

function GenDrop(expr, trait) {
    let S$ = this.startNode()
    S$.object = Utils.makeIdent.call(this, SName);
    S$.property = Utils.makeIdent.call(this, 'assume');
    S$.computed = false;
    S$ = this.finishNode(S$, "MemberExpression");

    let call = this.startNode();
    call.callee = S$;
    call.arguments = [expr];
    call = this.finishNode(call, "CallExpression");

    let is = this.startNode();
    is.object = call;
    is.property = Utils.makeIdent.call(this, 'drop');
    is.computed = false;
    is = this.finishNode(is, "MemberExpression");

    let result = this.startNode();
    result.callee = is;
    result.arguments = [GenTopT.call(this, GenerateTraitExprList.call(this, trait.annotations))];
    return this.finishNode(result, 'CallExpression');
}

export default {
    genTraitDef(name, dvals, extender) {

        let methodToCall = Member.call(this, Member.call(this, STName, 'Trait'), 'create', true);

        let newTrait = this.startNode();
        newTrait.callee = methodToCall;
        newTrait.arguments = [ToLiteral.call(this, name), WrapIdentList.call(this, dvals)];

        if (extender) {
            newTrait.arguments.push(extender);
        }

        newTrait.computed = false;
        newTrait = this.finishNode(newTrait, "CallExpression");

        return StoreInST.call(this, name, newTrait);
    },
    genTraitRule(trait, id, fn) {
        let methodToCall = Member.call(this, Member.call(this, STName, 'Trait'), 'extend', true);

        let node = this.startNode();
        node.callee = methodToCall;
        node.arguments = [trait, ToLiteral.call(this, id), fn];
        node.computed = false;
        return this.finishNode(node, "CallExpression");
    },
    rewriteReturn: RewriteReturn,
    genExpectation: GenExpectation,
    genTraitExpr(name) {
        return Member.call(this, STName, name, false, true);
    },
    genTest: GenTest,
    genSymbol(name, expr) {
        let node = this.startNode();
        node.callee = Member.call(this, SName, SymbolFn);
        node.arguments = [ToLiteral.call(this, name), expr];
        return this.finishNode(node, 'CallExpression');
    },
    genPureSymbol(name) {
        let node = this.startNode();
        node.callee = Member.call(this, SName, PureSymbolFn);
        node.arguments = [ToLiteral.call(this, name)];
        return this.finishNode(node, 'CallExpression');
    },
    genAs: GenAs,
    genDrop: GenDrop,
    genAssumeTrue(expr) {
        let S$ = MakeS$.call(this, 'assume');
        let S$Call = Call.call(this, S$, [expr]);
        let TrueCall = Member.call(this, S$Call, 'true', true);
        return Call.call(this, TrueCall, []);
    },
    genAssert: GenAssert
}

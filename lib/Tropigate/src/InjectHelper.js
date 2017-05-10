/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Utils from './Utils';
import Generator from './Generator';

function InjectPreConditions(node) {

    node.params.forEach(param => {
        if (param.expectedType) {
            node.body.body.unshift(Utils.wrapStatement.call(this, Generator.genExpectation.call(this, param, param.expectedType)));
        }
    });

    if (node.whereClause) {
        node.body.body.unshift(Generator.genAssert.call(this, node.whereClause, (node.id.name || "anonymous") + ' where clause failed'));
    }
}

function HandleIf(node, item) {
    HandleItem.call(this, node, item.consequent);
    if (item.alternate) {
        HandleItem.call(this, node, item.alternate);
    }
}

function HandleLoop(node, item) {
    HandleItem.call(this, node, item.body);
}

function HandleItem(node, item) {

    //TODO: This list isn't exhaustive, find a way to make ExpressionStatements and BlockStatements work
    if (item.type === "BlockStatement") {
        HandleBlock.call(this, node, item);
    } else if (item.type === "ForStatement" || item.type === "WhileStatement") {
        HandleLoop.call(this, node, item);
    } else if (item.type === "IfStatement") {
        HandleIf.call(this, node, item);
    } else {
        //console.log('ERROR - Unhandled Type of node in injection, possible code generation error');
    }
}

function HandleBlock(node, item) {
    item.body.forEach(item => HandleItem.bind(this, node));
    RecursiveInjectBlock.call(this, item);
}

function WholeInject(node) {
    HandleItem.call(this, node, node.body);
}

function RetInject(node, retExpr) {
    let argument = retExpr.argument ? retExpr.argument : Utils.makeIdent.call(this, 'undefined');
    return Generator.rewriteReturn(retExpr, argument, node.returnType);
}

function RecursiveInjectBlock(node) {
    let relevent = node.body;
    let nextIdx = relevent.findIndex(item => !item._typeInjectionDone && item.type === "ReturnStatement");
    if (nextIdx != -1) {
        if (node.returnType) {
            relevent[nextIdx] = RetInject.call(this, node, relevent[nextIdx]);
        }

        relevent[nextIdx]._typeInjectionDone = true;
        RecursiveInjectBlock.call(this, node);

        return;
    }
}

function InjectPostConditions(node, relevent) {
    WholeInject.call(this, node);
    if (node.returnType) {
        node.body.body.push(Utils.wrapStatement.call(this,
            Generator.genExpectation.call(this, Utils.makeIdent.call(this, 'undefined'), node.returnType)));
    }
}

function InjectExpectations(node) {
    InjectPreConditions.call(this, node);
    InjectPostConditions.call(this, node);
}

export default {
    injectExpectations: InjectExpectations
}

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Log from './Utilities/Log';
import ObjectHelper from './Utilities/ObjectHelper';
import Coverage from './Coverage';
import {WrappedValue, ConcolicValue} from './Values/WrappedValue';
import External from './External';
import Config from './Config';

const Stats = External('Stats');
const Z3 = External('z3javascript');

const USE_INCREMENTAL_SOLVER = Config.incrementalSolverEnabled;
Z3.Query.MAX_REFINEMENTS = Config.maxRefinements;

class SymbolicState {
    constructor(input, sandbox) {
        this.ctx = new Z3.Context();
        this.slv = new Z3.Solver(this.ctx, undefined, USE_INCREMENTAL_SOLVER);

        this.input = input;

        this.boolSort = this.ctx.mkBoolSort();
        this.stringSort = this.ctx.mkStringSort();
        this.realSort = this.ctx.mkRealSort();

        this.coverage = new Coverage(sandbox);

        this.inputSymbols = {};

        this.pathCondition = [];
        this.errors = [];

        this.stats = new Stats();
    }
    
    pushCondition(cnd, binder) {
    	this.pathCondition.push({
            ast: cnd,
            binder: binder || false,
            forkIid: this.coverage.last()
        });
    }

    symbolicConditional(result) {
        let [result_s, result_c] = [this.asSymbolic(result), this.getConcrete(result)];

        if (result_c === true) {
            Log.logMid(`Concrete result was true, pushing ${result_s}`);
            this.pushCondition(result_s);
        } else if (result_c === false) {
            Log.logMid(`Concrete result was false, pushing not of ${result_s}`);
            this.pushCondition(this.ctx.mkNot(result_s));
        } else {
            Log.log(`ERROR: Undefined Result: ${result_c}, ${result_s.toString()}`);
        }
    }

    /**
     *Formats PC to pretty string if length != 0
     */
    _stringPC(pc) {
        return pc.length ? pc.reduce((prev, current) => this.ctx.mkAnd(prev, current)).simplify() : '';
    }

    /**
     * Returns the final PC as a string (if any symbols exist)
     */
    finalPC() {
        return this._stringPC(this.pathCondition.filter(x => x.ast).map(x => x.ast));
    }

    _addInput(pc, solution, pcIndex, childInputs) {
        solution._bound = pcIndex + 1;
        childInputs.push({
            input: solution,
            pc: this._stringPC(pc),
            forkIid: this.pathCondition[pcIndex].forkIid
        });
    }

    _buildPC(childInputs, i) {
        Log.logMid(`Checking if ${ObjectHelper.asString(newPC)} is satisfiable with checks ${allChecks.length}`);

        const newPC = this.ctx.mkNot(this.pathCondition[i].ast);
        const allChecks = this.pathCondition.slice(0, i).reduce((last, next) => last.concat(next.ast.checks.trueCheck), []).concat(newPC.checks.trueCheck);
        const solution = this._checkSat(newPC, i, allChecks);

        if (solution) {
            this._addInput(newPC, solution, i, childInputs);
            Log.logHigh(`Satisfiable. Remembering new input: ${ObjectHelper.asString(solution)}`);
        } else {
            Log.logHigh(`${ObjectHelper.asString(newPC)} is not satisfiable`);
        }
    }

    _buildAsserts(i) {
        return this.pathCondition.slice(0, i).map(x => x.ast);
    }

    alternatives() {
        let childInputs = [];

        if (this.input._bound > this.pathCondition.length) {
            throw `Bound ${this.input._bound} > ${this.pathCondition.length}, divergence has occured`;
        }

        //Push all PCs up until bound
        this._buildAsserts(Math.min(this.input._bound, this.pathCondition.length)).forEach(x => this.slv.assert(x));
        this.slv.push();

        for (let i = this.input._bound; i < this.pathCondition.length; i++) {

            //TODO: Make checks on expressions smarter
            if (!this.pathCondition[i].binder) {
                this._buildPC(childInputs, i);
            }
            
            //Push the current thing we're looking at to the solver
            this.slv.assert(this.pathCondition[i].ast);
            this.slv.push();
        }

        this.slv.reset();

        // Generational search would now Run&Check all new child inputs
        return childInputs;
    }

    _getSort(concrete) {
        let sort;

        switch (typeof concrete) {
            case 'boolean':
                sort = this.boolSort;
                break;

            case 'number':
                sort = this.realSort;
                break;

            case 'string':
                sort = this.stringSort;
                break;

            default:
                Log.log(`Symbolic input variable of type ${typeof val} not yet supported.`);
        }

        return sort;
    }

    createPureSymbol(name) {
        let pureType = this.createSymbolicValue(name + "_type", "undefined");

        let res;

        if (this.mkTestEq(pureType, this.concolic("string"))) {
            res = this.createSymbolicValue(name, "seed_string");
        } else if (this.mkTestEq(pureType, this.concolic("number"))) {
            res = this.createSymbolicValue(name, 0);
        } else if (this.mkTestEq(pureType, this.concolic("boolean"))) {
            res = this.createSymbolicValue(name, false);
        } else if (this.mkTestEq(pureType, this.concolic("null"))) {
            res = null;
        } else {
            res = undefined;
        }

        return res;
    }

    createSymbolicValue(name, concrete) {

        this.stats.seen('Symbolic Values');

        let symbolic;

        if (concrete instanceof Array) {
            this.stats.seen('Symbolic Arrays');
            symbolic = this.ctx.mkArray(name, this._getSort(concrete[0]));
        } else {
            this.stats.seen('Symbolic Primitives');
            const sort = this._getSort(concrete);
            const symbol = this.ctx.mkStringSymbol(name);
            symbolic = this.ctx.mkConst(symbol, sort);
        }

        // Use generated input if available
        if (name in this.input) {
            concrete = this.input[name];
        } else {
            this.input[name] = concrete;
        }

        this.inputSymbols[name] = symbolic;

        Log.logMid(`Initializing fresh symbolic variable ${symbolic} using concrete value ${concrete}`);
        return new ConcolicValue(concrete, symbolic);
    }

    getSolution(model) {
    	let solution = {};

        for (let name in this.inputSymbols) {
            let solutionAst = model.eval(this.inputSymbols[name]);
            solution[name] = solutionAst.asConstant(model);
            solutionAst.destroy();
        }

        model.destroy();
        return solution;
    }

    _checkSat(clause, i, checks) {
        let model = (new Z3.Query([clause], checks)).getModel(this.slv);
        
	this.stats.max('Max Queries (Any)', Z3.Query.LAST_ATTEMPTS);

	if (model) {
		this.stats.max('Max Queries (Succesful)', Z3.Query.LAST_ATTEMPTS);
	} else {
		this.stats.seen('Failed Queries');
		if (Z3.Query.LAST_ATTEMPTS == Z3.Query.MAX_REFINEMENTS) {
			this.stats.seen('Failed Queries (Max Refinements)');
		}
	}

	return model ? this.getSolution(model) : undefined;
    }

    isSymbolic(val) {
        return !!ConcolicValue.getSymbolic(val);
    }

    getConcrete(val) {
        return WrappedValue.getConcrete(val);
    }

    asSymbolic(val) {
        return ConcolicValue.getSymbolic(val) || this.wrapConstant(val);
    }

    symbolicBinary(op, left_c, left_s, right_c, right_s) {
        this.stats.seen('Symbolic Binary');

        switch (op) {
            case "===":
            case "==":
                return this.ctx.mkEq(left_s, right_s);
            case "!==":
            case "!=":
                return this.ctx.mkNot(this.ctx.mkEq(left_s, right_s));
            case "&&":
                return this.ctx.mkAnd(left_s, right_s);
            case "||":
                return this.ctx.mkOr(left_s, right_s);
            case ">":
                return this.ctx.mkGt(left_s, right_s);
            case ">=":
                return this.ctx.mkGe(left_s, right_s);
            case "<=":
                return this.ctx.mkLe(left_s, right_s);
            case "<":
                return this.ctx.mkLt(left_s, right_s);
            case "+":
                return typeof left_c === 'string' ? this.ctx.mkSeqConcat([left_s, right_s]) : this.ctx.mkAdd(left_s, right_s);
            case "-":
                return this.ctx.mkSub(left_s, right_s);
            case "*":
                return this.ctx.mkMul(left_s, right_s);
            case "/":
                return this.ctx.mkDiv(left_s, right_s);
            case "%":
                return this.ctx.mkMod(left_s, right_s);
            default:
                Log.log(`Symbolic execution does not support operand ${op}, concretizing.`);
                break;
        }
        return undefined;
    }

    symbolicField(base_c, base_s, field_c, field_s) {
        this.stats.seen('Symbolic Field');

        function canHaveFields() {
            return typeof base_c === "string" || base_c instanceof Array;
        }

        function isRealNumber() {
            return typeof field_c === "number" && !Number.isNaN(field_c);
        }

        //TODO: We do not enforce < 0 => undefined here
        if (canHaveFields() && isRealNumber()) {
            if (field_c >= base_c.length) {
                this.pushCondition(this.ctx.mkGe(field_s, base_s.getLength()));
                return undefined;
            } else {
                this.pushCondition(this.ctx.mkLt(field_s, base_s.getLength()));
                return base_s.getAt(this.ctx.mkRealToInt(field_s));
            }
        }
    	
        switch (field_c) {
    		case 'length':
                if (base_s.getLength()) {
                    return base_s.getLength();
                }
    		default:
    			Log.log('Unsupported symbolic field - concretizing' + base_c + ' and field ' + field_c);
        }

    	return undefined;
    }

    symbolicCoerceToBool(val_c, val_s) {
        let result = undefined;

        if (typeof val_c === "boolean") {
            result = val_s;
        } else if (typeof val_c === "number") {
            result = this.symbolicBinary('!=', val_c, val_s, 0, this.wrapConstant(0));
        } else if (typeof val_c === "string") {
            result = this.symbolicBinary('!=', val_c, val_s, "", this.wrapConstant(""));
        } else {
            Log.logMid('Cannot coerce '+ val_c + ' to boolean');
        }

        return result;
    }

    symbolicUnary(op, left_c, left_s) {
        this.stats.seen('Symbolic Unary');

        switch (op) {
            case "!": {
                let bool_s = this.symbolicCoerceToBool(left_c, left_s);
                return bool_s ? this.ctx.mkNot(bool_s) : undefined;
            }

            case "+": {
                return typeof left_c === 'string' ? this.ctx.mkStrToInt(left_s) : left_s;
            }

            case "-":
                
                switch (typeof left_c) {
                    case 'string':
                        Log.log('Casting string to int, if its a real you will get incorrect result');
                        return this.ctx.mkStrToInt(left_s);
                }

                return this.ctx.mkUnaryMinus(left_s);
            case "typeof":
                return undefined;
            default:
                Log.logMid("Unsupported operand: " + op);
                return undefined;
        }
    }

    wrapConstant(val) {
        this.stats.seen('Wrapped Constants');
        switch (typeof val) {
            case 'boolean':
                return val ? this.ctx.mkTrue() : this.ctx.mkFalse();
            case 'number':
                return Math.round(val) === val ? this.ctx.mkReal(val, 1) : this.ctx.mkNumeral(String(val), this.realSort);
            case 'string':
                return this.ctx.mkString(val.toString());
            default:
                Log.log("Symbolic expressions with " + typeof val + " literals not yet supported.");
        }
    }

    concolic(val) {
        return this.isSymbolic(val) ? val : new ConcolicValue(val, this.wrapConstant(val));
    }

    mkTestEq(left, right) {
        console.log('WAAAARGH WAAARG ' + left.toString() + ' ' + right.toString());
        const equalityTest = this.symbolicBinary('==', this.getConcrete(left), this.asSymbolic(left), this.getConcrete(right), this.asSymbolic(right));
        this.pushCondition(equalityTest);
        return this.getConcrete(left) == this.getConcrete(right);
    }
}

export default SymbolicState;

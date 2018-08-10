/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */
"use strict";

import Log from './Utilities/Log';
import ObjectHelper from './Utilities/ObjectHelper';
import Coverage from './Coverage';
import External from './External';
import Config from './Config';
import SymbolicHelper from './SymbolicHelper';
import { SymbolicObject } from './Values/SymbolicObject';
import { WrappedValue, ConcolicValue } from './Values/WrappedValue';
import Z3 from 'z3javascript';
import Stats from 'Stats';

function BuildUnaryJumpTable(state) {
    const ctx = state.ctx;
    return {
        'boolean':  {
            '+': function(val_s) {
                return ctx.mkIte(val_s, state.constantSymbol(1), state.constantSymbol(0));
            },
            '-': function(val_s) {
                return ctx.mkIte(val_s, state.constantSymbol(-1), state.constantSymbol(0));               
            },
            '!': function(val_s) {
                return ctx.mkNot(val_s);
            }
        },
        'number': {
            '!': function(val_s, val_c) {
                let bool_s = state.asSymbolic(state.toBool(new ConcolicValue(val_c, val_s)));
                return bool_s ? ctx.mkNot(bool_s) : undefined;
            },
            '+': function(val_s) {
                return val_s;
            },
            '-': function(val_s) {
                return ctx.mkUnaryMinus(val_s);
            }
        },
        'string': {
            '!': function(val_s, val_c) {
                let bool_s = state.asSymbolic(state.toBool(new ConcolicValue(val_c, val_s)));
                return bool_s ? ctx.mkNot(bool_s) : undefined;
            },
            '+': function(val_s) {
                return ctx.mkStrToInt(val_s);
            },
            '-': function(val_s) {
                return ctx.mkUnaryMinus(
                    ctx.mkStrToInt(val_s)
                );
           }
        }
    } 
}

class SymbolicState {
    constructor(input, sandbox) {
        this.ctx = new Z3.Context();
        
        this.slv = new Z3.Solver(this.ctx,
            Config.incrementalSolverEnabled,
            [
                { name: 'timeout', value: Config.maxSolverTime },
                { name: 'random_seed', value: Math.floor(Math.random() * Math.pow(2, 32))},
                { name: 'phase_selection', value: 5 }
            ]
	    );

        Z3.Query.MAX_REFINEMENTS = Config.maxRefinements;

        this.input = input;
        this.inputSymbols = {};
        this.pathCondition = [];

        this.stats = new Stats();
        this.coverage = new Coverage(sandbox);
        this.errors = [];

        this._unaryJumpTable = BuildUnaryJumpTable(this);
        this._setupSmtFunctions();
    }

    /** Set up a bunch of SMT functions used by the models **/
    _setupSmtFunctions() {

        this.slv.fromString("(define-fun-rec str.repeat ((a String) (b Int)) String (if (<= b 0) \"\" (str.++ a (str.repeat a (- b 1)))))");
        this.stringRepeat = this.ctx.mkFunc(this.ctx.mkStringSymbol("str.repeat"), [this.ctx.mkStringSort(), this.ctx.mkIntSort()], this.ctx.mkStringSort());

        /** Set up trim methods **/
        this.slv.fromString( 
            "(define-fun str.isWhite ((c String)) Bool (= c \" \"))\n" + /** TODO: Make this reflect all the possible types of whitespace */
            "(define-fun-rec str.whiteLeft ((s String) (i Int)) Int (if (str.isWhite (str.at s i)) (str.whiteLeft s (+ i 1)) i))\n" +
            "(define-fun-rec str.whiteRight ((s String) (i Int)) Int (if (str.isWhite (str.at s i)) (str.whiteRight s (- i 1)) i))\n");
 
        this.whiteLeft = this.ctx.mkFunc(this.ctx.mkStringSymbol("str.whiteLeft"), [this.ctx.mkStringSort(), this.ctx.mkIntSort()], this.ctx.mkIntSort());
        this.whiteRight = this.ctx.mkFunc(this.ctx.mkStringSymbol("str.whiteRight"), [this.ctx.mkStringSort(), this.ctx.mkIntSort()], this.ctx.mkIntSort());
    }

    pushCondition(cnd, binder) {
        this.pathCondition.push({
            ast: cnd,
            binder: binder || false,
            forkIid: this.coverage.last()
        });
    }

    conditional(result) {

        const result_c = this.getConcrete(result),
              result_s = this.asSymbolic(result);

        if (result_c === true) {
            Log.logMid(`Concrete result was true, pushing ${result_s}`);
            this.pushCondition(result_s);
        } else if (result_c === false) {
            Log.logMid(`Concrete result was false, pushing not of ${result_s}`);
            this.pushCondition(this.ctx.mkNot(result_s));
        } else {
            Log.log(`WARNING: Symbolic Conditional on non-bool, concretizing`);
        }
        
        return result_c;
    }

    /**
     *Formats PC to pretty string if length != 0
     */
    _stringPC(pc) {
        return pc.length ? pc.reduce((prev, current) => {
            let this_line = current.simplify().toPrettyString().replace(/\s+/g, ' ').replace(/not /g, '¬');

            if (this_line.startsWith('(¬')) {
                this_line = this_line.substr(1, this_line.length - 2);
            }

            if (this_line == 'true' || this_line == 'false') {
                return prev;
            } else {
                return prev + (prev.length ? ', ' : '') + this_line;
            }    
        }, '') : '';
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

        const newPC = this.ctx.mkNot(this.pathCondition[i].ast);
        const allChecks = this.pathCondition.slice(0, i).reduce((last, next) => last.concat(next.ast.checks.trueCheck), []).concat(newPC.checks.trueCheck);
        const solution = this._checkSat(newPC, i, allChecks);

        Log.logMid(`Checking if ${ObjectHelper.asString(newPC)} is satisfiable`);

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
            console.log(this.slv.toString());

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

        switch (typeof(concrete)) {

            case 'boolean':
                sort = this.ctx.mkBoolSort();
                break;

            case 'number':
                sort = this.ctx.mkRealSort();
                break;

            case 'string':
                sort = this.ctx.mkStringSort();
                break;

            default:
                Log.log(`Symbolic input variable of type ${typeof val} not yet supported.`);
        }

        return sort;
    }

    _deepConcrete(arg) {
        /** TODO: Deep concretize shouldn't only conc if val is symbolic */
        arg = this.getConcrete(arg);

        if (arg instanceof Object) {
            for (let i in arg) {
		        const property = Object.getOwnPropertyDescriptor(arg, i);
                if (property && this.isSymbolic(property.value)) {
                    arg[i] = this._deepConcrete(arg[i]);
                }
            }
        }

        return arg;
    }

    concretizeCall(f, base, args, report = true) { 

        if (report) {
            this.stats.set('Concretized Function Calls', f.name);
            Log.logMid(`Concrete function concretizing all inputs ${ObjectHelper.asString(f)} ${ObjectHelper.asString(base)} ${ObjectHelper.asString(args)}`);
        } 

        base = this._deepConcrete(base);

        const n_args = Array(args.length);

        for (let i = 0; i < args.length; i++) {
            n_args[i] = this._deepConcrete(args[i]);
        }

        return {
            base: base,
            args: n_args
        }
    }

    createPureSymbol(name) {

        this.stats.seen('Pure Symbols');

        let pureType = this.createSymbolicValue(name + "_t", "undefined");

        let res;

        if (this.assertEqual(pureType, this.concolic("string"))) {
            res = this.createSymbolicValue(name, "seed_string");
        } else if (this.assertEqual(pureType, this.concolic("number"))) {
            res = this.createSymbolicValue(name, 0);
        } else if (this.assertEqual(pureType, this.concolic("boolean"))) {
            res = this.createSymbolicValue(name, false);
        } else if (this.assertEqual(pureType, this.concolic("object"))) {
            res = this.createSymbolicValue(name, {});
        } else if (this.assertEqual(pureType, this.concolic("array_number"))) {
            res = this.createSymbolicValue(name, [0]);
        } else if (this.assertEqual(pureType, this.concolic("array_string"))) {
            res = this.createSymbolicValue(name, [""]);
        } else if (this.assertEqual(pureType, this.concolic("array_bool"))) {
            res = this.createSymbolicValue(name, [false]);
        } else if (this.assertEqual(pureType, this.concolic("null"))) {
            res = null;
        } else {
            res = undefined;
        }

        return res;
    }

    /**
     * TODO: Symbol Renaming internalization
     */
    createSymbolicValue(name, concrete) {

        this.stats.seen('Symbolic Values');

        //TODO: Very ugly short circuit
        if (!(concrete instanceof Array) && typeof concrete === "object") {
            return new SymbolicObject(name);
        }

        let symbolic;
        let arrayType;

        if (concrete instanceof Array) {
            this.stats.seen('Symbolic Arrays');
            symbolic = this.ctx.mkArray(name, this._getSort(concrete[0]));
            this.pushCondition(this.ctx.mkGe(symbolic.getLength(), this.ctx.mkIntVal(0)), true);
            arrayType = typeof(concrete[0]);
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
        return new ConcolicValue(concrete, symbolic, arrayType);
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

        const startTime = (new Date()).getTime();
        let model = (new Z3.Query([clause], checks)).getModel(this.slv);
        const endTime = (new Date()).getTime();

        this.stats.max('Max Queries (Any)', Z3.Query.LAST_ATTEMPTS);

        if (model) {
            this.stats.max('Max Queries (Succesful)', Z3.Query.LAST_ATTEMPTS);
        } else {
            this.stats.seen('Failed Queries');
            if (Z3.Query.LAST_ATTEMPTS == Z3.Query.MAX_REFINEMENTS) {
                this.stats.seen('Failed Queries (Max Refinements)');
            }
        }

        Log.logQuery(clause.toString(),
            this.slv.toString(),
            checks.length,
            startTime,
            endTime,
            model ? model.toString() : undefined,
            Z3.Query.LAST_ATTEMPTS, Z3.Query.LAST_ATTEMPTS == Z3.Query.MAX_REFINEMENTS
        );

        return model ? this.getSolution(model) : undefined;
    }

    isWrapped(val) {
        return val instanceof WrappedValue;
    }

    isSymbolic(val) {
        return !!ConcolicValue.getSymbolic(val);
    }

    updateSymbolic(val, val_s) {
        return ConcolicValue.setSymbolic(val, val_s);
    }

    getConcrete(val) {
        return val instanceof WrappedValue ? val.getConcrete() : val;
    }

    arrayType(val) {
        return val instanceof WrappedValue ? val.getArrayType() : undefined;
    }

    getSymbolic(val) {
        return ConcolicValue.getSymbolic(val);
    }

    asSymbolic(val) {
        return ConcolicValue.getSymbolic(val) || this.constantSymbol(val);
    }

    _symbolicBinary(op, left_c, left_s, right_c, right_s) {
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
            case "<<":
            case "<<<":
                left_s = this.ctx.mkRealToInt(left_s);
                right_s = this.ctx.mkRealToInt(right_s);
                return this.ctx.mkIntToReal(this.ctx.mkMul(left_s, this.ctx.mkPower(this.ctx.mkIntVal(2), right_s)));
            case ">>":
            case ">>>":
                left_s = this.ctx.mkRealToInt(left_s);
                right_s = this.ctx.mkRealToInt(right_s);
                return this.ctx.mkIntToReal(this.ctx.mkDiv(left_s, this.ctx.mkPower(this.ctx.mkIntVal(2), right_s)));
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

    /** 
     * Symbolic binary operation, expects two concolic values and an operator
     */
    binary(op, left, right) {
        const result_c = SymbolicHelper.evalBinary(op, this.getConcrete(left), this.getConcrete(right));
        const result_s = this._symbolicBinary(op, this.getConcrete(left), this.asSymbolic(left), this.getConcrete(right), this.asSymbolic(right));
        return result_s ? new ConcolicValue(result_c, result_s) : result_c;
    }

    /**
     * Symbolic field lookup - currently only has support for symbolic arrays / strings
     */
    symbolicField(base_c, base_s, field_c, field_s) {
        this.stats.seen('Symbolic Field');

        function canHaveFields() {
            return typeof base_c === "string" || base_c instanceof Array;
        }

        function isRealNumber() {
            return typeof field_c === "number" && Number.isFinite(field_c);
        }

        if (canHaveFields() && isRealNumber()) { 

            const withinBounds = this.ctx.mkAnd(
                this.ctx.mkGt(field_s, this.ctx.mkIntVal(-1)),
                this.ctx.mkLt(field_s, base_s.getLength())
            );
            
            if (this.conditional(new ConcolicValue(field_c > -1 && field_c < base_c.length, withinBounds))) {
                return base_s.getField(this.ctx.mkRealToInt(field_s));
            } else {
                return undefined;
            }
        }

        switch (field_c) {
            case 'length':
                if (base_s.getLength()) {
                    return base_s.getLength();
                }
            default:
                Log.log('Unsupported symbolic field - concretizing ' + base_c + ' and field ' + field_c);
        }

        return undefined;
    }

    /**
     * Coerce either a concrete or ConcolicValue to a boolean
     * Concretizes the ConcolicValue if no coercion rule is known
     */
    toBool(val) {
        
        if (this.isSymbolic(val)) {
            const val_type = typeof this.getConcrete(val);

            switch (val_type) {
                case "boolean":
                    return val;
                case "number":
                    return this.binary('!=', val, this.concolic(0));
                case "string":
                    return this.binary('!=', val, this.concolic(""));
            }

            Log.log('WARNING: Concretizing coercion to boolean (toBool) due to unknown type');
        }

        return this.getConcrete(!!val);
    }

    /**
     * Perform a symbolic unary action.
     * Expects an Expr and returns an Expr or undefined if we don't
     * know how to do this op symbolically
     */
    _symbolicUnary(op, left_c, left_s) {
        this.stats.seen('Symbolic Unary');

        const unaryFn = this._unaryJumpTable[typeof(left_c)][op];

        if (unaryFn) {
            return unaryFn(left_s, left_c);
        } else {
            Log.log(`Unsupported symbolic operand: ${op} on ${left_c} symbolic ${left_s}`);
            return undefined;
        }
    }

    /**
     * Perform a unary op on a ConcolicValue or a concrete value
     * Concretizes the ConcolicValue if we don't know how to do that action symbolically
     */
    unary(op, left) {
        const result_c = SymbolicHelper.evalUnary(op, this.getConcrete(left));
        const result_s = this.isSymbolic(left) ? this._symbolicUnary(op, this.getConcrete(left), this.asSymbolic(left)) : undefined;
        return result_s ? new ConcolicValue(result_c, result_s) : result_c;
    }

    /**
     * Return a symbol which will always be equal to the constant value val
     * returns undefined if the theory is not supported.
     */
    constantSymbol(val) {
        this.stats.seen('Wrapped Constants');

        if (typeof(val) === "object") {
            val = val.valueOf();
        }
 
        switch (typeof(val)) {
            case 'boolean':
                return val ? this.ctx.mkTrue() : this.ctx.mkFalse();
            case 'number':
                return Math.round(val) === val ? this.ctx.mkReal(val, 1) : this.ctx.mkNumeral(String(val), this.realSort);
            case 'string':
                return this.ctx.mkString(val.toString());
            default:
                Log.log("Symbolic expressions with " + typeof(val) + " literals not yet supported.");
        }

        return undefined;
    }

    /**
     * If val is a symbolic value then return val otherwise wrap it
     * with a constant symbol inside a ConcolicValue.
     *
     * Used to turn a concrete value into a constant symbol for symbolic ops.
     */
    concolic(val) {
        return this.isSymbolic(val) ? val : new ConcolicValue(val, this.constantSymbol(val));
    }

    /**
     * Assert left == right on the path condition
     */
    assertEqual(left, right) {
        const equalityTest = this.binary('==', left, right);
        this.conditional(equalityTest);
        return this.getConcrete(equalityTest);
    }
}

export default SymbolicState;

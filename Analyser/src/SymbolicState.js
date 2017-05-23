/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Z3 from 'z3javascript';
import Log from './Utilities/Log';
import ObjectHelper from './Utilities/ObjectHelper';
import {WrappedValue, ConcolicValue} from './Values/WrappedValue';

class SymbolicState {
    constructor(context, solver, input) {

        this.ctx = context;
        this.slv = solver;
        this.input = input;

        this.boolSort = this.ctx.mkBoolSort();
        this.stringSort = this.ctx.mkStringSort();
        this.realSort = this.ctx.mkRealSort();

        this.inputSymbols = {};

        this.pathCondition = [];

        this.errors = [];
    }

    getErrorCount() {
        return this.errors.length;
    }

    addError(error) {
        this.errors.push(error);
    }

    /**
     * Push a binder condition to the PC,
     * Binder conditions are just conditions that must be true for a PC to hold
     * And are not negated to build new paths
     */
    pushBinder(cnd) {
        this.pathCondition.push({
            ast: cnd,
            binder: true
        });
    }
    
    pushCondition(cnd) {
    	this.pathCondition.push({
            ast: cnd,
            binder: false
        });
    }

    pushNot(cnd) {
        this.pushCondition(this.ctx.mkNot(cnd));
    }

    symbolicConditional(result) {
        let [result_s, result_c] = [this.getSymbolic(result), this.getConcrete(result)];

        if (result_c === true) {
            Log.logMid("Concrete result was true, pushing " + result_s);
            this.pushCondition(result_s);
        } else if (result_c === false) {
            Log.logMid("Concrete result was false, pushing not of " + result_s);
            this.pushNot(result_s);
        } else {
            Log.log("Result: " + result_c.toString() + ' and ' + result_s.toString() + " (" + typeof(result_c) + ")");
            Log.log("Undefined result not yet supported");
        }
    }

    /**
     * Roll PC into a single AND'ed PC
     */
    _simplifyPC(pc) {
        return pc.reduce((prev, current) => this.ctx.mkAnd(prev, current)).simplify();
    }

    /**
     *Formats PC to pretty string if length != 0
     */
    _stringPC(pc) {
        if (pc.length) {
            return this._simplifyPC(pc).toPrettyString();
        } else {
            return "";
        }
    }

    /**
     * Returns the final PC as a string (if any symbols exist)
     */
    finalPC() {
        return this._stringPC(this.pathCondition.map(x => x.ast));
    }

    /**
     * Regenerate the final input object from the path condition (for output)
     * Use initial input if the PC couldn't be satisfied (Some serious issues has occured)
     */
    finalInput() {
        return this.input;
    }

    _buildPC(childInputs, i) {
        let newPC = this.ctx.mkNot(this.pathCondition[i].ast).simplify();
        Log.logMid('Checking if ' + ObjectHelper.asString(newPC) + ' is satisfiable');
        
        let solution = this._checkSat(newPC);

        if (solution) {
            solution._bound = i + 1;
            
            childInputs.push({
                input: solution,
                pc: this._stringPC(newPC)
            });
           
            Log.logMid("Satisfiable. Remembering new input: " + ObjectHelper.asString(solution));
        } else {
            Log.logMid("Unsatisfiable.");
        }
    }

    alternatives() {
        let childInputs = [];

        if (this.input._bound > this.pathCondition.length) {
            Log.log('Bound > PathCondition');
            Log.log('Warning: This path has diverged');
        }

        //Push all PCs up until bound
        for (let i = 0; i < Math.min(this.input._bound, this.pathCondition.length); i++) {
            this.slv.assert(this.pathCondition[i].ast);
        }

        for (let i = this.input._bound; i < this.pathCondition.length; i++) {
            
            if (!this.pathCondition[i].binder) {
                this._buildPC(childInputs, i);
            }
            
            //Push the current thing we're looking at to the solver
            this.slv.assert(this.pathCondition[i].ast);
            console.log('Asserted ' + this.pathCondition[i].ast.toString());
        }

        this.slv.reset();

        // Generational search would now Run&Check all new child inputs
        return childInputs;
    }

    createSymbolicValue(name, concrete) {

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
                Log.log("Symbolic input variable of type " + typeof val + " not yet supported.");
        }

        let symbol = this.ctx.mkStringSymbol(name);
        let symbolic = this.ctx.mkConst(symbol, sort);

        // Use generated input if available
        if (name in this.input) {
            concrete = this.input[name];
        } else {
            this.input[name] = concrete;
        }

        this.inputSymbols[name] = symbolic;

        Log.logMid("Initializing fresh symbolic variable \"" + symbolic + "\" using concrete value \"" + concrete + "\"");
        return new ConcolicValue(concrete, symbolic);
    }

    getSolution(model) {
    	let solution = {};

        for (let name in this.inputSymbols) {
            let solutionAst = model.eval(this.inputSymbols[name]);
            solution[name] = solutionAst.asConstant();
            solutionAst.destroy();
        }

        model.destroy();
        return solution;
    }

    _checkSat(clause) {

        let result;

        this.slv.push();
        {
            this.slv.assert(clause);
            Log.logMid('Solver: ' + this.slv.toString());
            let model = this.slv.getModel();
            result = model ? this.getSolution(model) : undefined;
        }
        this.slv.pop();

        return result;
    }

    isSymbolic(val) {
        return !!ConcolicValue.getSymbolic(val);
    }

    getSymbolic(val) {
        return ConcolicValue.getSymbolic(val);
    }

    isWrapped(val) {
        return WrappedValue.isWrapped(val);
    }

    getConcrete(val) {
        return WrappedValue.getConcrete(val);
    }

    asSymbolic(val) {
        return this.getSymbolic(val) || this.wrapConstant(val);
    }

    getAnnotations(val) {
        return WrappedValue.getAnnotations(val);
    }

    symbolicBinary(op, left_c, left_s, right_c, right_s) {

        let ctx = this.ctx;

        /**
         * TODO: The following code forces coercions to int, rather than
         * Letting the default upgrading to reals happen.
         * This is awful code to fix a silly bug in Z3
         * Remove ASAP
         */
        function coerceInt(s) {
            if (!s.FORCE_EQ_TO_INT) {
                return ctx.mkRealToInt(s);
            }
            return s;
        }

        let resultIsInt = false;

        if (left_s.FORCE_EQ_TO_INT || right_s.FORCE_EQ_TO_INT) {
            left_s = coerceInt(left_s);
            right_s = coerceInt(right_s);
            resultIsInt = true;
        }

        let result;

        switch (op) {
            case "===":
            case "==":
                result = this.ctx.mkEq(left_s, right_s);
                break;
            case "!==":
            case "!=":
                result = this.ctx.mkNot(this.ctx.mkEq(left_s, right_s));
                break;
            case "&&":
                result = this.ctx.mkAnd(left_s, right_s);
                break;
            case "||":
                result = this.ctx.mkOr(left_s, right_s);
                break;
            case ">":
                result = this.ctx.mkGt(left_s, right_s);
                break;
            case ">=":
                result = this.ctx.mkGe(left_s, right_s);
                break;
            case "<=":
                result = this.ctx.mkLe(left_s, right_s);
                break;
            case "<":
                result = this.ctx.mkLt(left_s, right_s);
                break;
            case "+":
                if (typeof left_c == "string") {
                    result = this.ctx.mkSeqConcat([left_s, right_s]);
                } else {
            	   result = this.ctx.mkAdd(left_s, right_s);
                }
                break;
            case "-":
                result = this.ctx.mkSub(left_s, right_s);
                break;
            case "*":
                result = this.ctx.mkMul(left_s, right_s);
                break;
            case "/":
                result = this.ctx.mkDiv(left_s, right_s);
                break;
            case "%":
                result = this.ctx.mkMod(left_s, right_s);
                break;
            default:
                Log.log("Symbolic execution does not support operand \"" + op + "\", concretizing.");
                return undefined;
        }

        //Tags results as int
        if (resultIsInt) {
            result.FORCE_EQ_TO_INT = true;
        }

        return result;
    }

    _symbolicFieldStrLookup(base_c, base_s, field_c, field_s) {
        Log.log('WARNING: symbolic charAt support new and buggy');
        let lookupCnd = this.ctx.mkNot(this.symbolicBinary('>=', base_c.length, this.symbolicField(base_c, base_s, 'length'), field_c, this.wrapConstant(field_c)));
        this.symbolicConditional(new ConcolicValue(base_c.length < field_c, lookupCnd));
        return this.ctx.mkSeqAt(base_s, this.ctx.mkRealToInt(field_s));
    }

    symbolicField(base_c, base_s, field_c, field_s) {

        if (typeof base_c === "string" && typeof field_c === "number") {
            return this._symbolicFieldStrLookup(base_c, base_s, field_c, field_s);
        }
    	
        switch (field_c) {
    		case 'length':                
                if (typeof base_c == "string") {
                    //TODO: This is a stupid solution to a more fundamental problem in Z3
                    //Remove ASAP
                    let res = this.ctx.mkSeqLength(base_s);
                    res.FORCE_EQ_TO_INT = true;
                    return res;
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
        switch (op) {
            case "!": {
                let bool_s = this.symbolicCoerceToBool(left_c, left_s);
                return bool_s ? this.ctx.mkNot(bool_s) : undefined;
            }
            case "+": {

                switch (typeof left_c) {
                    case 'string':
                        return this.ctx.mkStrToInt(left_s);
                }

                //For numeric types, +N => N
                //I don't see this being done often, generally only used to coerce
                //But some tit might write var x = +5;
                return left_s;
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
}

export default SymbolicState;

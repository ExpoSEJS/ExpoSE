/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import {WrappedValue, ConcolicValue} from './Values/WrappedValue';
import ObjectHelper from './Utilities/ObjectHelper';
import SymbolicState from './SymbolicState';
import SymbolicHelper from './SymbolicHelper';
import Log from './Utilities/Log';
import NotAnErrorException from './NotAnErrorException';
import {isNative} from './Utilities/IsNative';
import ModelBuilder from './FunctionModels';
import External from './External';

//Electron can't resolve external library's directly. The External packages makes that transparent
const Tropigate = External('Tropigate');

class SymbolicExecution {

    constructor(sandbox, initialInput, exitFn) {
        this._sandbox = sandbox;
        this.state = new SymbolicState(initialInput, this._sandbox);
        this.models = ModelBuilder(this.state);
        this._fileList = new Array();

        //Bind any uncaught exceptions to the uncaught exception handler
        process.on('uncaughtException', this._uncaughtException.bind(this));

        //Bind the exit handler to the exit callback supplied
        process.on('exit', exitFn.bind(null, this.state, this.state.coverage));
    }

    _uncaughtException(e) {

        //Ignore NotAnErrorException
        if (e instanceof NotAnErrorException) {
            return;
        }

        Log.log('Uncaught exception ' + e + (e.stack ? ('(stack ' + e.stack + ')') : ''));

        this.state.errors.push({
            error: '' + e,
            stack: e.stack
        });
    }

    invokeFunPre(iid, f, base, args, isConstructor, isMethod) {
        this.state.coverage.touch(iid);
        Log.logHigh('Execute function ' + ObjectHelper.asString(f) + ' at ' + this._location(iid));
        
        f = this.state.getConcrete(f);

        /**
         * Concretize the function if it is native and we do not have a custom model for it
         */

        let modelled = !!this.models[f];

        if (!modelled && isNative(f)) {
            
            this.state.stats.set('Concretized Function Calls', f.name);

            Log.logMid(`Concrete function concretizing all inputs ${ObjectHelper.asString(f)} ${ObjectHelper.asString(base)} ${ObjectHelper.asString(args)}`);
            Log.logMid('TODO: Potential Issue: Not deep concretize in IsNative application');
            
            base = this.state.getConcrete(base);

            let n_args = new Array(args.length);

            for (let i = 0; i < args.length; i++) {
                n_args[i] = this.state.getConcrete(args[i]);
            }

            args = n_args;
        }

        /**
         * End of conc
         */

        return {
            f: f,
            base: base,
            args: args,
            skip: modelled
        };
    }

    //Called after a function completes execution
    invokeFun(iid, f, base, args, result, isConstructor, isMethod) {
        this.state.coverage.touch(iid);

        Log.logHigh('Exit function (' + ObjectHelper.asString(f) + ') near ' + this._location(iid));

        if (this.models[f]) {
            result = this.models[f](f, base, args, result);
        }

        return {
            result: result
        };
    }

    literal(iid, val, hasGetterSetter) {
        this.state.coverage.touch(iid);
        return {
            result: val
        };
    }

    forinObject(iid, val) {
        this.state.coverage.touch(iid);
        return {
            result: val
        };
    }

    _location(iid) {
        return this._sandbox.iidToLocation(this._sandbox.getGlobalIID(iid));
    }

    endExpression(iid) {
        this.state.coverage.touch(iid);
    }

    declare(iid, name, val, isArgument, argumentIndex, isCatchParam) {
        this.state.coverage.touch(iid);
        Log.logHigh('Declare ' + name + ' at ' + this._location(iid));
        return {
            result: val
        };
    }

    getFieldPre(iid, base, offset, isComputed, isOpAssign, isMethodCall) {
        this.state.coverage.touch(iid);
        return {
            base: base,
            offset: offset,
            skip: false
        };
    }

    getField(iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
        this.state.coverage.touch(iid);
        Log.logHigh('Get field ' + ObjectHelper.asString(base) + '.' + ObjectHelper.asString(offset) + ' at ' + this._location(iid));

        if (this.state.isSymbolic(offset) && typeof this.state.getConcrete(offset) == 'string') {
            const base_c = this.state.getConcrete(base);
            const offset_c = this.state.getConcrete(offset);
            for (let idx in base_c) {
                if (offset_c != base_c[idx]) {
                    this.state.pushCondition(this.state.ctx.mkNot(this.state.symbolicBinary('==', idx, this.state.asSymbolic(idx), offset_c, this.state.asSymbolic(offset))));
                }
            }
        }

        let result_s = this.state.isSymbolic(base) ? this.state.symbolicField(this.state.getConcrete(base), this.state.asSymbolic(base), this.state.getConcrete(offset), this.state.asSymbolic(offset)) : undefined;
        let result_c = this.state.getConcrete(base)[this.state.getConcrete(offset)];
        let result = result_s ? new ConcolicValue(result_c, result_s) : result_c;

        return {
            result: result
        };
    }

    putFieldPre(iid, base, offset, val, isComputed, isOpAssign) {
        this.state.coverage.touch(iid);
        Log.logHigh('Put field ' + ObjectHelper.asString(base) + '.' + ObjectHelper.asString(offset) + ' at ' + this._location(iid));

        return {
            base: this.state.getConcrete(base),
            offset: this.state.getConcrete(offset),
            val: val,
            skip: false,
        };
    }

    putField(iid, base, offset, val, isComputed, isOpAssign) {
        this.state.coverage.touch(iid);
        Log.logHigh('PutField ' + base.toString() + ' ' + offset);
        return {
            result: val
        };
    }

    read(iid, name, val, isGlobal, isScriptLocal) {
        this.state.coverage.touch(iid);
        Log.logHigh('Read ' + name + ' at ' + this._location(iid));

        return {
            result: val
        };
    }

    write(iid, name, val, lhs, isGlobal, isScriptLocal) {
        this.state.coverage.touch(iid);
        Log.logHigh('Write ' + name + ' at ' + this._location(iid));

        return {
            result: val
        };
    }

    _return(iid, val) {
        this.state.coverage.touch(iid);

        return {
            result: val
        };
    }

    _throw(iid, val) {
        this.state.coverage.touch(iid);

        return {
            result: val
        };
    }

    _with(iid, val) {
        this.state.coverage.touch(iid);
        return {result: val};
    }

    functionEnter(iid, f, dis, args) {
        this.state.coverage.touch(iid);
        Log.logHigh('Entering ' + ObjectHelper.asString(f) + ' ' + this._location(iid));
    }

    functionExit(iid, returnVal, wrappedExceptionVal) {
        this.state.coverage.touch(iid);

        Log.logHigh('Exiting function ' + this._location(iid));

        return {
            returnVal: returnVal,
            wrappedExceptionVal: wrappedExceptionVal,
            isBacktrack: false
        };
    }

    _scriptDepth() {
        return this._fileList.length;
    }

    _addScript(fd) {
        this._fileList.push(fd);
    }

    _removeScript() {
        return this._fileList.pop();
    }

    scriptEnter(iid, instrumentedFileName, originalFileName) {
        this.state.coverage.touch(iid);

        let enterString = "====== ENTERING SCRIPT " + originalFileName + " depth " + this._scriptDepth() + " ======";

        if (this._scriptDepth() == 0) {
            Log.log(enterString);
        } else {
            Log.logMid(enterString);
        }

        this._addScript(originalFileName);
    }

    scriptExit(iid, wrappedExceptionVal) {
        this.state.coverage.touch(iid);
        let originalFileName = this._removeScript();
        let exitString = "====== EXITING SCRIPT " + originalFileName + " depth " + this._scriptDepth() + " ======";

        if (this._scriptDepth() > 0) {
            Log.logMid(exitString);
        } else {
            Log.log(exitString);
        }

        return {
            wrappedExceptionVal: wrappedExceptionVal,
            isBacktrack: false
        };
    }

    binaryPre(iid, op, left, right, isOpAssign, isSwitchCaseComparison, isComputed) {
        
        let left_c = this.state.getConcrete(left),
            right_c = this.state.getConcrete(right);

        //Don't do symbolic logic if the symbolic values are diff types
        //Concretise instead
        if (typeof left_c !== typeof right_c) {
            Log.log("Concretizing binary " + op + " on operands of differing types. Type coercion not yet implemented symbolically. (" + ObjectHelper.asString(left_c) + ", " + ObjectHelper.asString(right_c) + ') (' + typeof left_c + ', ' + typeof right_c + ')');
            left = left_c;
            right = right_c;
        } else {
            Log.logHigh('Not concretizing ' + op + ' ' + left + ' ' + right + ' ' + typeof left_c + ' ' + typeof right_c);
        }

        // Don't evaluate natively when args are symbolic
        return {
            op: op,
            left: left,
            right: right,
            skip: this.state.isSymbolic(left) || this.state.isSymbolic(right)
        };
    }

    binary(iid, op, left, right, result_c, isOpAssign, isSwitchCaseComparison, isComputed) {
        this.state.coverage.touch(iid);
        Log.logHigh('Op ' + op + ' left ' + ObjectHelper.asString(left) + ' right ' + ObjectHelper.asString(right) + ' result_c ' + ObjectHelper.asString(result_c) + ' at ' + this._location(iid));

        if (this.state.isSymbolic(left) || this.state.isSymbolic(right)) {
            return this._binarySymbolic(op, left, right, result_c);
        } else {
            return {
                result: result_c
            }
        }
    }

    _binarySymbolic(op, left, right, result_c) {

        let [left_c, right_c] = [this.state.getConcrete(left), this.state.getConcrete(right)];
        let result = SymbolicHelper.evalBinary(op, left_c, right_c);

        Log.logMid("Symbolically evaluating binary " + op + ", which has concrete result \"" + result_c + "\"");

        let result_s = this.state.symbolicBinary(op, left_c, this.state.asSymbolic(left), right_c, this.state.asSymbolic(right));
        result = result_s ? new ConcolicValue(result, result_s) : result;

        return {
            result: result
        };
    }

    unaryPre(iid, op, left) {
        this.state.coverage.touch(iid);

        // Don't evaluate natively when args are symbolic
        return {
            op: op,
            left: left,
            skip: this.state.isSymbolic(left)
        }
    }

    unary(iid, op, left, result_c) {
        this.state.coverage.touch(iid);

        Log.logHigh('Unary ' + op + ' left ' + ObjectHelper.asString(left) + ' result ' + ObjectHelper.asString(result_c));

        if (this.state.isSymbolic(left)) {
            return this._unarySymbolic(op, left, result_c);
        } else if (this.state.isSymbolic(left)) {
            result_c = SymbolicHelper.evalUnary(op, this.state.getConcrete(left));
        }

        return {
            result: result_c
        };
    }

    _unarySymbolic(op, left, result_c) {

        let left_s = this.state.asSymbolic(left);
        let left_c = this.state.getConcrete(left);

        result_c = SymbolicHelper.evalUnary(op, this.state.getConcrete(left));

        Log.logMid("Symbolically evaluating unary " + op + "(" + left_s + "), which has concrete result \"" + result_c + "\"");

        let result_s = this.state.symbolicUnary(op, left_c, left_s);

        let result = result_s ? new ConcolicValue(result_c, result_s) : result_c;

        return {
            result: result
        };
    }

    _toBool(val) {
        let val_c = this.state.getConcrete(val);
        let val_s = this.state.asSymbolic(val);
        let result_s = this.state.symbolicCoerceToBool(val_c, val_s);
        return result_s ? new ConcolicValue(!!val_c, result_s) : undefined;
    }

    conditional(iid, result) {
        this.state.coverage.touch(iid);

        if (this.state.isSymbolic(result)) {
            Log.logMid("Evaluating symbolic condition " + this.state.asSymbolic(result) + " at " + this._location(iid));
            result = this._toBool(result);

            if (result) {
                this.state.symbolicConditional(result);
            } else {
                Log.logMid('Concretized ' + result + ' because do not know how to coerce');
            }

        } else {
            Log.logHigh("Concrete test at " + this._location(iid));
        }

        return {
            result: this.state.getConcrete(result)
        };
    }

    instrumentCodePre(iid, code) {

        try {
            code = Tropigate(code);
        } catch (e) {
            throw 'Tropigate failed because ' + e + ' on program ' + code + ' at ' + e.stack;
        }

        return {
            code: code,
            skip: false
        };
    }

    instrumentCode(iid, code, newAst) {
        return {
            result: code
        };
    }

    runInstrumentedFunctionBody(iid) {
        this.state.coverage.touch(iid);
        return false;
    }

    onReady(cb) {
        cb();
    }
}

export default SymbolicExecution;

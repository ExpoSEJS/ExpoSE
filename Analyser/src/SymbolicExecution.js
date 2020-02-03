/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2014@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

/*global window*/
/*global Element*/
/*global document*/

import {ConcolicValue} from "./Values/WrappedValue";
import {SymbolicObject} from "./Values/SymbolicObject";
import ObjectHelper from "./Utilities/ObjectHelper";
import SymbolicState from "./SymbolicState";
import Log from "./Utilities/Log";
import NotAnErrorException from "./NotAnErrorException";
import {isNative} from "./Utilities/IsNative";
import ModelBuilder from "./Models/Models";
import External from "./External";

class SymbolicExecution {

	constructor(sandbox, initialInput, exitFn) {
		this._sandbox = sandbox;
		this.state = new SymbolicState(initialInput, this._sandbox);
		this.models = ModelBuilder(this.state);
		this._fileList = new Array();
		this._exitFn = exitFn;

		if (typeof window !== "undefined") {

			window._ExpoSE = this;

			setTimeout(() => {
				console.log("Finish timeout (callback)");
				this.finished();
				External.close();
			}, 1000 * 60 * 1);

			const storagePool = {};

			window.localStorage.setItem = function(key, val) {
				storagePool[key] = val;
			};

			window.localStorage.getItem = function(key) { 
				return storagePool[key];
			};

			console.log("Browser mode setup finished");

		} else { 
			const process = External.load("process");

			//Bind any uncaught exceptions to the uncaught exception handler
			process.on("uncaughtException", this._uncaughtException.bind(this));

			//Bind the exit handler to the exit callback supplied
			process.on("exit", this.finished.bind(this));
		}

	}

	finished() {
		this._exitFn(this.state, this.state.coverage);
	}

	_uncaughtException(e) {

		//Ignore NotAnErrorException
		if (e instanceof NotAnErrorException) {
			return;
		}

		Log.log(`Uncaught exception ${e} Stack: ${e.stack ? e.stack : ""}`);

		this.state.errors.push({
			error: "" + e,
			stack: e.stack
		});
	}

	report(sourceString) {

		if (!this.state.isSymbolic(sourceString)) {
			if (sourceString.documentURI) {
				sourceString = "" + sourceString.documentURI;
			} else if (sourceString.baseURI) {
				sourceString = "" + sourceString.baseURI;
			} else if (sourceString && sourceString.toString) {
				let tsourceString = sourceString.toString();
				if (tsourceString.includes("Object]")) {
					sourceString = ObjectHelper.asString(sourceString);
				} else {
					sourceString = tsourceString;
				}
			} else {
				sourceString = ObjectHelper.asString(sourceString);
			}
		} else {
			sourceString = this.state.asSymbolic(sourceString).simplify();
		}

		console.log(`OUTPUT_LOAD_EVENT: !!!${this.state.inlineToSMTLib()}!!! !!!"${sourceString}"!!!`);
	}

	_reportFn(f, base, args) {
		if (typeof(window) !== "undefined") {
			if ((f.name == "appendChild" || f.name == "prependChild" || f.name == "insertBefore" || f.name == "replaceChild") && args[0] && (args[0].src || args[0].innerHTML.includes("src="))) {
				this.report(args[0].src);
				args[0].src = this.state.getConcrete(args[0].src);
			}
      
			if (f.name == "open" || f.name == "fetch") {
				console.log("REPORTING FN OPEN " + JSON.stringify(args));
				this.report(args[1]);
			}
		}
	}

	invokeFunPre(iid, f, base, args, _isConstructor, _isMethod) {
		this.state.coverage.touch(iid);
		Log.logHigh(`Execute function ${ObjectHelper.asString(f)} at ${this._location(iid)}`);

		f = this.state.getConcrete(f);
		this._reportFn(f, base, args);

		const functionName = f ? f.name : "undefined";

		const fn_model = this.models.get(f);
		Log.logMid(fn_model ? ("Exec Model: " + functionName + " " + (new Error()).stack) : functionName + " unmodeled");

		/**
		 * Concretize the function if it is native and we do not have a custom model for it
		 * TODO: We force concretization on toString functions to avoid recursive call from the lookup into this.models
		 * TODO: This is caused by getField(obj) calling obj.toString()
		 * TODO: A better solution to this needs to be found
		 */
		if (!fn_model && isNative(f)) {
			const concretized = this.state.concretizeCall(f, base, args);
			base = concretized.base;
			args = concretized.args;
			if (concretized.count > 0) {
				this.state.stats.set("Unmodeled Function Call", functionName);
			}
		} else if (fn_model) {
			this.state.stats.set("Modeled Function Call", functionName);
		} else {
			this.state.stats.seen("General Function Call");
		}

		/**
		 * End of conc
		 */
		return {
			f: fn_model || f,
			base: base,
			args: args,
			skip: false
		};
	}

	/**
	 * Called after a function completes execution
	 */
	invokeFun(iid, f, base, args, result, _isConstructor, _isMethod) {
		this.state.coverage.touch(iid);
		Log.logHigh(`Exit function (${ObjectHelper.asString(f)}) near ${this._location(iid)}`);
		return { result: result };
	}

	literal(iid, val, _hasGetterSetter) {
		this.state.coverage.touch(iid);
		return { result: val };
	}

	forinObject(iid, val) {
		this.state.coverage.touch(iid);
		return { result: val };
	}

	_location(iid) {
		return this._sandbox.iidToLocation(this._sandbox.getGlobalIID(iid));
	}

	endExpression(iid) {
		this.state.coverage.touch(iid);
	}

	declare(iid, name, val, _isArgument, _argumentIndex, _isCatchParam) {
		this.state.coverage.touch(iid);
		Log.logHigh(`decl ${name} at ${this._location(iid)}`);
		return {
			result: val
		};
	}

	getFieldPre(iid, base, offset, _isComputed, _isOpAssign, _isMethodCall) {
		this.state.coverage.touch(iid);
		return {
			base: base,
			offset: offset,
			skip: this.state.isWrapped(base) || this.state.isWrapped(offset)
		};
	}

	_getFieldSymbolicOffset(base, offset) {
		offset = this.state.ToString(offset);   
		const base_c = this.state.getConcrete(base);
		for (const idx in base_c) {
			const is_this_idx = this.state.binary("==", idx, offset);
			this.state.pushCondition(this.state.asSymbolic(is_this_idx));
		}
	}

	/** 
     * GetField will be skipped if the base or offset is not wrapped (SymbolicObject or isSymbolic)
     */
	getField(iid, base, offset, _val, _isComputed, _isOpAssign, _isMethodCall) {

		//TODO: This is a horrible hacky way of making certain request attributes symbolic
		//TODO: Fix this!
		if (typeof(window) != "undefined") {
            
			if (base == window.navigator) {
				if (offset == "userAgent") {
					return { result: Object._expose.makeSymbolic(offset, window.navigator.userAgent) };
				}
			}

			if (base == window.document) {
				if (offset == "cookie") {
					return { result: Object._expose.makeSymbolic(offset, "") };
				}            

				if (offset == "lastModified") {
					return { result: Object._expose.makeSymbolic(offset, window.document.lastModified) };
				}

				if (offset == "referrer") {
					return { result: Object._expose.makeSymbolic(offset, window.document.referer) };
				} 
			}

			if (base == window.location) {
				if (offset == "origin") {
					return { result: Object._expose.makeSymbolic(offset, window.location.origin) };
				}
				if (offset == "host") {
					return { result: Object._expose.makeSymbolic(offset, window.location.host) };
				}
			}

		}

		Log.logHigh(`Get field ${ObjectHelper.asString(base)}[${ObjectHelper.asString(offset)}] at ${this._location(iid)}`);

		//If dealing with a SymbolicObject then concretize the offset and defer to SymbolicObject.getField
		if (base instanceof SymbolicObject) {
			Log.logMid("Potential loss of precision, cocretize offset on SymbolicObject field lookups");
			return {
				result: base.getField(this.state, this.state.getConcrete(offset))
			};
		}

		//If we are evaluating a symbolic string offset on a concrete base then enumerate all fields
		//Then return the concrete lookup
		if (!this.state.isSymbolic(base) && 
             this.state.isSymbolic(offset) &&
             typeof this.state.getConcrete(offset) == "string") {
			this._getFieldSymbolicOffset(base, offset);
			return {
				result: base[this.state.getConcrete(offset)]
			};
		}

		//If the array is a symbolic int and the base is a concrete array then enumerate all the indices
		if (!this.state.isSymbolic(base) &&
             this.state.isSymbolic(offset) &&
             this.state.getConcrete(base) instanceof Array &&
             typeof this.state.getConcrete(offset) == "number") {

			for (let i = 0; i < this.state.getConcrete(base).length; i++) {
				this.state.assertEqual(i, offset); 
			}

			return {
				result: base[this.state.getConcrete(offset)]
			};
		}

		//Otherwise defer to symbolicField
		const result_s = this.state.isSymbolic(base) ? this.state.symbolicField(this.state.getConcrete(base), this.state.asSymbolic(base), this.state.getConcrete(offset), this.state.asSymbolic(offset)) : undefined;
		const result_c = this.state.getConcrete(base)[this.state.getConcrete(offset)];

		return {
			result: result_s ? new ConcolicValue(result_c, result_s) : result_c
		};
	}

	putFieldPre(iid, base, offset, val, _isComputed, _isOpAssign) {
		this.state.coverage.touch(iid);
		Log.logHigh(`Put field ${ObjectHelper.asString(base)}[${ObjectHelper.asString(offset)}] at ${this._location(iid)}`);

		if (this.state.getConcrete(offset) === "src"
        || this.state.getConcrete(offset) === "href") {
			this.report(val);	
			val = this.state.getConcrete(val);
		}

		return {
			base: base,
			offset: offset,
			val: val,
			skip: this.state.isWrapped(base) || this.state.isWrapped(offset)
		};
	}

	putField(iid, base, offset, val, _isComputed, _isOpAssign) {

		Log.logHigh(`PutField ${base.toString()} at ${offset}`);

		if (base instanceof SymbolicObject) {
			return {
				result: base.setField(this.state, this.state.getConcrete(offset), val)
			};
		}

		//TODO: Enumerate if symbolic offset and concrete input

		if (this.state.isSymbolic(base) && this.state.getConcrete(base) instanceof Array && this.state.arrayType(base) == typeof(val)) {
			Log.log("TODO: Check that setField is homogonous");

			//SetField produce a new array
			//Therefore the symbolic portion of base needs to be updated
			const base_s = this.state.asSymbolic(base).setField(
				this.state.asSymbolic(offset),
				this.state.asSymbolic(val));

			this.state.getConcrete(base)[this.state.getConcrete(offset)] = val; 
			this.state.updateSymbolic(base, base_s);

			if (typeof(document) !== "undefined" && this.state.getConcrete(base) instanceof Element && document.contains(this.state.getConcrete(base)) && offset === "innerHTML") {
				const tv = this.state.getConcrete(val);
				if (typeof(tv) === "string" && tv.includes("src=")) {
					const sourceString = this.state.asSymbolic(val).toString();
					this.report(sourceString);
				}
			}

			return {
				result: val
			};
		}

		this.state.getConcrete(base)[this.state.getConcrete(offset)] = val;

		return { result: val };
	}

	read(iid, name, val, _isGlobal, _isScriptLocal) {
		this.state.coverage.touch(iid);
		Log.logHigh(`Read ${name} at ${this._location(iid)}`);
		return { result: val };
	}

	write(iid, name, val, _lhs, _isGlobal, _isScriptLocal) {
		this.state.coverage.touch(iid);
		Log.logHigh(`Write ${name} at ${this._location(iid)}`);
		return { result: val };
	}

	_return(iid, val) {
		this.state.coverage.touch(iid);
		return { result: val };
	}

	_throw(iid, val) {
		this.state.coverage.touch(iid);
		return { result: val };
	}

	_with(iid, val) {
		this.state.coverage.touch(iid);
		Log.logHigh("With {val}");
		return { result: val };
	}

	functionEnter(iid, f, _dis, _args) {
		this.state.coverage.touch(iid);
		Log.logHigh(`Entering ${ObjectHelper.asString(f)} near ${this._location(iid)}`);
	}

	functionExit(iid, returnVal, wrappedExceptionVal) {
		this.state.coverage.touch(iid);
		Log.logHigh(`Exiting function ${this._location(iid)}`);
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
		//this.state.coverage.touch(iid);

		const enterString = `====== ENTERING SCRIPT ${originalFileName} depth ${this._scriptDepth()} ======`;

		if (this._scriptDepth() == 0) {
			Log.log(enterString);
		} else {
			Log.logMid(enterString);
		}

		this._addScript(originalFileName);
	}

	scriptExit(iid, wrappedExceptionVal) {
		//this.state.coverage.touch(iid);
		
		const originalFileName = this._removeScript();
		const exitString = `====== EXITING SCRIPT ${originalFileName} depth ${this._scriptDepth()} ======`;

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

	binaryPre(iid, op, left, right, _isOpAssign, _isSwitchCaseComparison, _isComputed) {
 
		//Don't do symbolic logic if the symbolic values are diff types
		//Concretise instead
		if (this.state.isWrapped(left) || this.state.isWrapped(right)) {
 
			const left_c  = this.state.getConcrete(left);
			const right_c = this.state.getConcrete(right);

			//We also consider boxed primitives to be primitive
			const is_primative = typeof(left_c) != "object" || (left_c instanceof Number || left_c instanceof String || left_c instanceof Boolean);
			const is_null = left_c === undefined || right_c === undefined || left_c === null || right_c === null;
			const is_real = typeof(left_c) == "number" ? (Number.isFinite(left_c) && Number.isFinite(right_c)) : true;

			//TODO: Work out how to check that boxed values are the same type
			const is_same_type = typeof(left_c) === typeof(right_c) || (!is_null && left_c.valueOf() === right_c.valueOf());

			if (!is_same_type || !is_primative || is_null || !is_real) {
				Log.log(`Concretizing binary ${op} on operands of differing types. Type coercion not yet implemented symbolically. (${ObjectHelper.asString(left_c)}, ${ObjectHelper.asString(right_c)}) (${typeof left_c}, ${typeof right_c})`);
				left = left_c;
				right = right_c;
			} else {
				Log.logHigh("Not concretizing " + op + " " + left + " " + right + " " + typeof left_c + " " + typeof right_c);
			}

		}

		// Don't evaluate natively when args are symbolic
		return {
			op: op,
			left: left,
			right: right,
			skip: this.state.isWrapped(left) || this.state.isWrapped(right)
		};
	}

	binary(iid, op, left, right, result_c, _isOpAssign, _isSwitchCaseComparison, _isComputed) {
		this.state.coverage.touch(iid);

		Log.logHigh("Op " + op + " left " + ObjectHelper.asString(left) + " right " + ObjectHelper.asString(right) + " result_c " + ObjectHelper.asString(result_c) + " at " + this._location(iid));

		let result;

		if (this.state.isSymbolic(left) || this.state.isSymbolic(right)) {
			result = this.state.binary(op, left, right);
		} else {
			result = result_c;
		}

		return {
			result: result
		};
	}

	unaryPre(iid, op, left) {

		// Don't evaluate natively when args are symbolic
		return {
			op: op,
			left: left,
			skip: this.state.isWrapped(left)
		};
	}

	unary(iid, op, left, result_c) {
		this.state.coverage.touch(iid);

		Log.logHigh("Unary " + op + " left " + ObjectHelper.asString(left) + " result " + ObjectHelper.asString(result_c)); 

		return {
			result: this.state.unary(op, left)
		};
	}

	conditional(iid, result) {
		this.state.coverage.touch_cnd(iid, this.state.getConcrete(result)); 
		Log.logHigh(`Evaluating conditional ${ObjectHelper.asString(result)}`);

		if (this.state.isSymbolic(result)) {
			Log.logMid(`Evaluating symbolic condition ${this.state.asSymbolic(result)} at ${this._location(iid)}`);
			this.state.conditional(this.state.toBool(result));
		}

		return { result: this.state.getConcrete(result) };
	}

	instrumentCodePre(iid, code) {
		return { code: code, skip: false };
	}

	instrumentCode(iid, code, _newAst) {
		return { result: code };
	}

	/*runInstrumentedFunctionBody(iid) {}*/
	onReady(cb) { cb(); }
}

export default SymbolicExecution;

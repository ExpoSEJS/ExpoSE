/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

import { WrappedValue } from "./WrappedValue";

class SymbolicObject extends WrappedValue {
    
    constructor(name) {
       	super({});

       	this._name = name;
        this._core = this.getConcrete();
        this._set = {};
        this._lastIndex = 0;
    }

    setField(state, offset, v) {
    	
    	state.stats.seen("Symbolic Object Field Overrides");

    	this._core[offset] = v;
    	this._set[offset] = true;
    }

    getField(state, offset) {

    	state.stats.seen("Symbolic Object Field Lookups");
    	
    	if (!this._set[offset]) {
        //Can't use offset in name, if offset is a symbol is will crash
    		this._core[offset] = state.createPureSymbol(`${this._name}_elements_${offset}_${this._lastIndex++}`);
    	}

    	return this._core[offset];
    }

    delete(offset) {
    	this._set[offset] = false;
    	delete this._core[offset];
    }
}

export { SymbolicObject };

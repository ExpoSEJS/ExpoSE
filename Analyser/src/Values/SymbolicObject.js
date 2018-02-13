import { WrappedValue } from './WrappedValue';

class SymbolicObject extends WrappedValue {
    
    constructor(name) {
       	super({});

       	this._name = name;
        this._core = this.getConcrete();
        this._set = {};
    }

    setField(state, offset, v) {
    	
    	state.stats.seen('Symbolic Object Field Overrides');

    	this._core[offset] = v;
    	this._set[offset] = true;
    }

    getField(state, offset) {

    	state.stats.seen('Symbolic Object Field Lookups');
    	
    	if (!this._set[offset]) {
    		this._core[offset] = state.createPureSymbol(this._name + '_' + offset);
    	}

    	return this._core[offset];
    }

    delete(offset) {
    	this._set[offset] = false;
    	delete this._core[offset];
    }
}

export { SymbolicObject };

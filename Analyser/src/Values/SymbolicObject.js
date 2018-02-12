import {ConcolicValue} from './WrappedValue';

/**
 * Implementation of untyped symbolic values
 */
class PureSymbol extends ConcolicValue {

}

/**
 * Container for naive symbolic objects 
 */
class ConcolicObject {
    
    constructor(state, name) {
        this._state = state;
    }

    _findField(name) {}
    setField(name, v) {}
    getField(name) {}
}

export { ConcolicObject, PureSymbol };

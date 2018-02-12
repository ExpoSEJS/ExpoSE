import {ConcolicValue} from './WrappedValue';

/**
 * Implementation of untyped symbolic values
 */
class PureSymbol extends ConcolicValue {

}

/**
 * Container for naive symbolic objects 
 */
class ConcolicObject extends ConcolicValue {
    
    constructor(state) {
        this._state = state;
    }

    _findField(name) {}
    setField(name, v) {}
    getField(name) {}
}

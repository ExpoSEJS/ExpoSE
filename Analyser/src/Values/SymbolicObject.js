import {ConcolicValue} from './WrappedValue';

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

export { ConcolicObject };

/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

import Log from './Utilities/Log';
import ObjectHelper from './Utilities/ObjectHelper';
import {WrappedValue, ConcolicValue} from './Values/WrappedValue';
import NotAnErrorException from './NotAnErrorException';

export default {
    wrapSymbolic: function(state, args) {
        return new ConcolicValue(args[0], this.state.asSymbolic(args[0]));
    },

    makeSymbolic: function(state, args) {
        return state.createSymbolicValue(args[0], args[1]);
    },

    wrap: function(state, args) {
        return WrappedValue.wrap(args[0]);
    },

    notAnErrorException: function(state, args) {
        return NotAnErrorException;
    },
    
    clone: function(state, args) {
        return WrappedValue.clone(args[0]);
    },

    getRider: function(state, args) {
        let val = args[0];

        if (!val || !val instanceof WrappedValue) {
            Log.log('Could not get rider of unwrapped value (' + ObjectHelper.asString(val) + ')');
            return;
        }

        return val.rider;
    },

    setRider: function(state, args) {
        let val = args[0];
        let rider = args[1];

        if (!val instanceof WrappedValue) {
            Log.log('Could not set rider of unwrapped value (' + ObjectHelper.asString(val) + ')');
            return;
        }

        val.rider = rider;
    }
};

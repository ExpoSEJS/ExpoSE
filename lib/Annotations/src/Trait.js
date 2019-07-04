"no_prelude";
"use strict";

function mk(c, args) {
    function F(args) {
        return c.apply(this, args);
    }
    F.prototype = c.prototype;
    return new F(args);
}

class Annotation {

    constructor(params) {
        this._params = params ? params.filter(p => p) : [];
    }

    /**
     * Return the parametric type this trait was created with
     */
    params() {
        return this._params;
    }

    /**
     * Return the dependents this type was created with
     */
    args() {
        return [];
    }

    isSubtypeOf(sTrait) {

        if (!(this instanceof sTrait.constructor)) {
            return false;
        }

        /**
         * Returns true if there is an element in arr[i] in arr that satisfies pred(arr[i])
         */
        function Exists(arr, pred) {
            for (let i in arr) {
                if (pred(arr[i], i)) {
                    return true;
                }
            }
            return false;
        }

        //If there exists some sTrait.param which is not a supertype of some this.param
        if (Exists(sTrait.params(), x => !this.paramIsSubtype(x))) {
            return false;
        }

        //Find some dependant in the sTrait which isnt mapped in this trait
        if (Exists(sTrait.args(), (val, i) => this.args()[i] != val)) {
            return false;
        }

        return true;
    }

    paramIsSubtype(other) {
        return this.params().find(x => x.isSubtypeOf(other));
    }

    /**
     * Makes the supertype of a trait, if called on something that returns the top type (Trait internally) then return undefined.
     */
    makeSuperType(params, dependants) {
        let parentProto = this.constructor == Annotation ? this.constructor : this.constructor.prototype.constructor;

        if (parentProto === Annotation) {
            return undefined;
        }

        let args = [parentProto, params].concat(dependants.slice(parentProto.cNumDependants));
        return mk(this.constructor, args);
    }

    /**
     * Generate the traits resulting from a drop assuming this.isSubtypeOf(other)
     */
    generateDrop(other) {
        if (other.params().length == 0) {
            return other.makeSuperType(this.params(), this.args())
        } else {
            let newParams = this.params().map(item => {
                let relatedSubtype = other.params().find(op => item.isSubtypeOf(op));
                if (relatedSubtype) {
                    return item.generateDrop(relatedSubtype);
                } else {
                    return item;
                }
            }).filter(item => item !== undefined);
            return mk(this.constructor, newParams.concat(this.args()));
        }
    }

    /**
     * Generate the traits resulting from an as assuming this.isSubtypeOf(other)
     */
    generateAs(other) {
        if (other.params().length == 0) {
            return this;
        } else {
            let paramL = this._asParams(other);
            return S$.t.apply(S$, [this.constructor, paramL].concat(this.args()));
        }
    }

    _asNullCommon(paraml, common) {
        common.forEach(idx => delete paraml[idx]);
    }

    _asPushNonNull(froml, tol) {
        froml.forEach(item => {
            if (item) {
                tol.push(item);
            }
        });
    }

    _asParams(other) {

        //Take copies of the arrays so we dont accidentally mutate this trait
        let lparams = this.params().slice(0);
        let rparams = other.params().slice(0);

        //Array for result
        let params = [];

        //Arrays to store common elements from each
        let commonl = [];
        let commonr = [];

        lparams.forEach((lparam, lidx) => {
            rparams.forEach((rparam, ridx) => {
                if (lparam.isSubtypeOf(rparam)) {
                    params.push(rparam.generateAs(lparam));
                    commonl.push(lidx);
                    commonr.push(ridx);
                } else if (rparam.isSubtypeOf(lparam)) {
                    params.push(lparam.generateAs(rparam));
                    commonl.push(lidx);
                    commonr.push(ridx);
                }
            });
        });

        //Make any common element in paraml and paramr undefined
        this._asNullCommon(lparams, commonl);
        this._asNullCommon(rparams, commonr);

        //Push any non null elements from lists to params
        this._asPushNonNull(lparams, params);
        this._asPushNonNull(rparams, params);

        return params;
    }

    toString() {
        let tString = this._trait_name;

        if (this.params().length > 0) {
            tString += "<!";

            this.params().forEach((p, i) => {
                tString += (i != 0 ? ' * ' : '') + p.toString();
            });

            tString += "!>";
        }

        if (this.args().length) {
            tString += '(';

            this.args().forEach((d, i) => {
                tString += (i != 0 ? ', ' : '') + d;
            });

            tString += ')';
        }

        return tString;
    }
}

/**
 * Returns a function which returns discard: false, result: arguments[n]
 */
function NoOp(r) {
    if (r == -1) {
        return function() {
          return [false]; 
        };
    } else {
        return function() {
          return [false, arguments[r]];
        };
    }
}

//Generate the NoOp functions 
Annotation.prototype.attached = NoOp(-1);
Annotation.prototype.discarded = NoOp(-1);
Annotation.prototype.isRead = NoOp(-1);
Annotation.prototype.isWritten = NoOp(-1);
Annotation.prototype.isReturned = NoOp(-1);
Annotation.prototype.getField = NoOp(2);
Annotation.prototype.setField = NoOp(2);
Annotation.prototype.invokedOn = NoOp(3);
Annotation.prototype.binary = NoOp(4);
Annotation.prototype.unary = NoOp(2);
Annotation.prototype._trait_name = 'TRAIT_SHOULD_NOT_BE_USED_DIRECTLY';

//Store on the trait object the number of dependant values this Trait takes
Annotation.cNumDependants = 0;
Annotation.extend = function(trait, field, callback) {
    trait.prototype[field] = callback(trait.prototype[field]);
}

Annotation.create = function(name, dependants, fromTrait) {

    if (!fromTrait) {
        fromTrait = Annotation;
    }

    let newTrait = class extends fromTrait {
        
        constructor(params, ...args) {
            super(params);
            dependants.forEach((d, i) => this[d] = args[i]);
        }

        args() {
            return dependants.map(d => this[d]);
        }
    };

    newTrait.prototype._trait_name = name;
    newTrait.cNumDependants = dependants.length;

    return newTrait;
}

export default Annotation;

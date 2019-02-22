import { ConcolicValue } from "../Values/WrappedValue";
import Log from "../Utilities/Log";
import External from "../External";

const Z3 = External.load("z3javascript").default;

const find = Array.prototype.find;

export default function(state, ctx, model, helpers) {

  function symbolicStringify(field) {
    console.log('Field is', JSON.stringify(field));
    if (field === undefined) {
      return undefined;
    } else if (field === null) {
      return "null";
    } else if (state.getConcrete(field) instanceof Array) {
      let rstr = '[';
      field = state.getConcrete(field);
      for (let i = 0; i < field.length; i++) {
        if (i > 0) {
          rstr = state.binary('+', rstr, ', ');
        }
        rstr = state.binary('+', rstr, symbolicStringify(field[i]));
      }
      rstr = state.binary('+', rstr, ']');
      return rstr;
    } else if (state.getConcrete(field) instanceof Object) {
      let rstr = '{';
      let first = true;
      for (let key of Object.getOwnPropertyNames(field)) {
        console.log('Field', JSON.stringify(field), ' key', key);
        let name = state.binary('+', '"', state.binary('+', key, '"'));
        let encodedField = symbolicStringify(field[key]);
        let merged = state.binary('+', name, state.binary('+', ':', encodedField));
        rstr = state.binary('+', rstr, merged);
        if (first) {
          rstr = state.binary('+', rstr, ',');
        }
        first = false;
      }
      rstr = state.binary('+', rstr, '}');
      return rstr;
    } else if (typeof state.getConcrete(field) === "string") {
      return `"${field}"`;
    } else {
      return state.getConcrete(field);
    }
  }

  model.add(JSON.stringify, function(base, args) {
    return symbolicStringify(args[0]);
  });
}

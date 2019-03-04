import { ConcolicValue } from "../Values/WrappedValue";
import Log from "../Utilities/Log";
import External from "../External";

const Z3 = External.load("z3javascript").default;

const find = Array.prototype.find;

export default function(state, ctx, model, helpers) {

  function symbolicStringify(field) {
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
        let name = state.binary('+', '"', state.binary('+', key, '"'));
        let encodedField = symbolicStringify(field[key]);
        let merged = state.binary('+', name, state.binary('+', ':', encodedField));
        if (!first) {
          rstr = state.binary('+', rstr, ',');
        }
				rstr = state.binary('+', rstr, merged);
        first = false;
      }
      rstr = state.binary('+', rstr, '}');
      return rstr;
    } else if (typeof state.getConcrete(field) === "string") {
      return state.binary('+', '"', state.binary('+', field, '"'));
    } else {
      return helpers.coerceToString(field);
    }
  }

  model.add(JSON.stringify, function(base, args) {
		const result = symbolicStringify(args[0]);
		Log.logMid('JSON stringified: ' + result.toString());
		return result;
  });
}

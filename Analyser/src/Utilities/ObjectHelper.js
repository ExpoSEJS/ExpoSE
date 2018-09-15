/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */



const MAX_LOG_DEPTH = 2;

class ObjectHelper {}

ObjectHelper.functionName = function(fn) {
    return fn.name || "anonymous";
};

ObjectHelper.safe = function(item) {
    item.__safe_item_to_string = true;
};

ObjectHelper.isSafe = function(item) {
    return item && item.__safe_item_to_string;
};

ObjectHelper.startsWith = function(str1, searchString){
    return str1.substr(0, searchString.length) === searchString;
};

ObjectHelper.repeat = function(str, count) {
    let repeatedStr = "";
    while (count > 0) {
        repeatedStr += str;
        count--;
    }
    return repeatedStr;
};

ObjectHelper.enumerate = function(item, depth) {
    if (depth < MAX_LOG_DEPTH) {
        if (item instanceof Array) {
            return "[" + item.reduce((last, next) => last + (last.length == 0 ? "" : ", ") + ObjectHelper.asString(next, false, depth + 1), "") + "]";
        } else if (item instanceof Object) {
            let result = "{";
            let first = true;
            for (let property in item) {
                result += (first ? "" : ",") + "\n" + ObjectHelper.repeat("    ", depth + 1) + property + ": " + ObjectHelper.asString(item[property], false, depth + 1);
                first = false;
            }
            result += "\n}";
            return result;
        }
    } else {
        return "Max Depth";
    }

    return "Unstringable";
};

ObjectHelper.asString = function(item, forceSafe, depth) {

    //If depth is undefined make it 0
    depth = depth || 0;

    if (item instanceof Function) {
        return ObjectHelper.functionName(item);
    }

    if (typeof item === "number" || typeof item === "boolean" || typeof item === "string" || item === undefined || item === null) {
        return "" + item;
    }

    if (forceSafe || ObjectHelper.isSafe(item)) {
        return item.toString();
    } else if (item instanceof Symbol) {
        return "Unstringable";
    } else {
        return ObjectHelper.enumerate(item, depth);
    }
};

export default ObjectHelper;
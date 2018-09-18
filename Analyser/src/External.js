/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

function is_external() {
    return typeof window !== "undefined";
}

//Cache electron so require doesn't get rewritten
const ld = is_external() ? require("electron").remote.require : require;

export default {
    load: function (library) {
        return ld(library);
    },
    is_external: is_external
};

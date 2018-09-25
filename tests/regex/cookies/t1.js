const S$ = require('S$');

function loadSrc(obj, src) {
    throw src;
}

const cookies = S$.symbol('Cookie', '');
const world = {};

if (cookies) {
    if (/iPhone/.exec(cookies)) {
        loadSrc(world, '/resources/' + cookies);
    }

    loadSrc(world, '/resources/unknown');
} else {
    loadSrc(world, '/resources/fresh');
}

var value = symbolic VALUE initial 1;
var decimal = symbolic DECIMAL initial 3;
var rounded = Math.round(decimal);

if (value != rounded) {
    throw 'R1';
} else {
    throw 'R2';
}

"use strict";
exports.__esModule = true;
exports.truncatedString = void 0;
var truncatedString = function (str) {
    if (!str)
        return "";
    return (str.substring(0, 7) + "..." + str.substring(str.length - 5, str.length));
};
exports.truncatedString = truncatedString;

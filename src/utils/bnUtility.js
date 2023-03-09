"use strict";
exports.__esModule = true;
exports.fromBN = exports.toBN = void 0;
var util_1 = require("@polkadot/util");
var big_js_1 = require("big.js");
var bigConstants_1 = require("./bigConstants");
var bnConstants_1 = require("./bnConstants");
big_js_1["default"].PE = 256; // The positive exponent value at and above which toString returns exponential notation.
big_js_1["default"].NE = -256; // The negative exponent value at and below which toString returns exponential notation.
big_js_1["default"].DP = 40; // The maximum number of decimal places of the results of operations involving division.
big_js_1["default"].RM = big_js_1["default"].roundUp; // Rounding mode
var DEFAULT_TOKEN_DECIMALS = 18;
var DEFAULT_DECIMAL_MULTIPLIER = bigConstants_1.BIG_TEN.pow(DEFAULT_TOKEN_DECIMALS);
var toBN = function (value, exponent) {
    if (!value)
        return bnConstants_1.BN_ZERO;
    try {
        var inputNumber = (0, big_js_1["default"])(value);
        var decimalMultiplier = !exponent || exponent === DEFAULT_TOKEN_DECIMALS
            ? DEFAULT_DECIMAL_MULTIPLIER
            : bigConstants_1.BIG_TEN.pow(exponent);
        var res = inputNumber.mul(decimalMultiplier);
        var resStr = res.toString();
        if (/\D/gm.test(resStr))
            return bnConstants_1.BN_ZERO;
        return new util_1.BN(resStr);
    }
    catch (err) {
        return bnConstants_1.BN_ZERO;
    }
};
exports.toBN = toBN;
var fromBN = function (value, exponent) {
    if (!value)
        return "0";
    try {
        var inputNumber = (0, big_js_1["default"])(value.toString());
        var decimalMultiplier = !exponent || exponent === DEFAULT_TOKEN_DECIMALS
            ? DEFAULT_DECIMAL_MULTIPLIER
            : bigConstants_1.BIG_TEN.pow(exponent);
        var res = inputNumber.div(decimalMultiplier);
        var resStr = res.toString();
        return resStr;
    }
    catch (err) {
        return "0";
    }
};
exports.fromBN = fromBN;

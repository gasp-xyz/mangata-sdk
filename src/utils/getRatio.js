"use strict";
exports.__esModule = true;
exports.getRatio = void 0;
var bnConstants_1 = require("./bnConstants");
var getGcd = function (a, b) {
    return b.gt(bnConstants_1.BN_ZERO) ? getGcd(b, a.mod(b)) : a;
};
var calculateRatio = function (numerator, denominator) {
    var gcd = getGcd(numerator, denominator);
    if (gcd.isZero())
        return [bnConstants_1.BN_ZERO, bnConstants_1.BN_ZERO];
    var gcd1 = numerator.div(gcd);
    var gcd2 = denominator.div(gcd);
    return [gcd1, gcd2];
};
var getRatio = function (left, right) {
    var ratios = calculateRatio(left, right);
    var res = ratios[1].mul(bnConstants_1.BN_DIV_NUMERATOR_MULTIPLIER).div(ratios[0]);
    return res;
};
exports.getRatio = getRatio;

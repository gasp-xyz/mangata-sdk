"use strict";
exports.__esModule = true;
exports.getWeightXTokens = void 0;
var getWeightXTokens = function (weight, extrinsicCall) {
    var _a;
    return ((_a = extrinsicCall === null || extrinsicCall === void 0 ? void 0 : extrinsicCall.meta.args.at(-1)) === null || _a === void 0 ? void 0 : _a.type.eq("XcmV2WeightLimit"))
        ? {
            Limited: weight
        }
        : weight;
};
exports.getWeightXTokens = getWeightXTokens;

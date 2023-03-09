"use strict";
exports.__esModule = true;
exports.getError = void 0;
var util_1 = require("@polkadot/util");
var getError = function (api, method, eventData) {
    var _a, _b, _c, _d;
    var failedEvent = method === "ExtrinsicFailed";
    if (failedEvent) {
        var error = eventData.find(function (item) {
            return item.lookupName.includes("DispatchError");
        });
        var errorData = (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.toHuman) === null || _b === void 0 ? void 0 : _b.call(_a);
        var errorIdx = (_c = errorData === null || errorData === void 0 ? void 0 : errorData.Module) === null || _c === void 0 ? void 0 : _c.error;
        var moduleIdx = (_d = errorData === null || errorData === void 0 ? void 0 : errorData.Module) === null || _d === void 0 ? void 0 : _d.index;
        if (errorIdx && moduleIdx) {
            try {
                var decode = api.registry.findMetaError({
                    error: (0, util_1.isHex)(errorIdx) ? (0, util_1.hexToU8a)(errorIdx) : new util_1.BN(errorIdx),
                    index: new util_1.BN(moduleIdx)
                });
                return {
                    documentation: decode.docs,
                    name: decode.name
                };
            }
            catch (error) {
                return {
                    documentation: ["Unknown error"],
                    name: "UnknownError"
                };
            }
        }
        else {
            return {
                documentation: ["Unknown error"],
                name: "UnknownError"
            };
        }
    }
    return null;
};
exports.getError = getError;

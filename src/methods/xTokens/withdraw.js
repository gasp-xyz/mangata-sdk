"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.withdraw = void 0;
var util_crypto_1 = require("@polkadot/util-crypto");
var util_1 = require("@polkadot/util");
var getWeightXTokens_1 = require("../../utils/getWeightXTokens");
var signTx_1 = require("../../signTx");
var withdraw = function (instancePromise, args) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenSymbol, withWeight, parachainId, account, destinationAddress, amount, txOptions, api, correctAddress, assetRegistryMetadata, assetMetadata, tokenId, destination, destWeightLimit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokenSymbol = args.tokenSymbol, withWeight = args.withWeight, parachainId = args.parachainId, account = args.account, destinationAddress = args.destinationAddress, amount = args.amount, txOptions = args.txOptions;
                return [4 /*yield*/, instancePromise];
            case 1:
                api = _a.sent();
                correctAddress = (0, util_crypto_1.encodeAddress)(destinationAddress, 42);
                return [4 /*yield*/, api.query.assetRegistry.metadata.entries()];
            case 2:
                assetRegistryMetadata = _a.sent();
                assetMetadata = assetRegistryMetadata.find(function (metadata) {
                    var symbol = metadata[1].value.symbol.toPrimitive();
                    return symbol === tokenSymbol;
                });
                if (!(assetMetadata && assetMetadata[1].value.location)) return [3 /*break*/, 4];
                tokenId = assetMetadata[0].toHuman()[0].replace(/[, ]/g, "");
                destination = {
                    V1: {
                        parents: 1,
                        interior: {
                            X2: [
                                {
                                    Parachain: parachainId
                                },
                                {
                                    AccountId32: {
                                        network: "Any",
                                        id: api.createType("AccountId32", correctAddress).toHex()
                                    }
                                }
                            ]
                        }
                    }
                };
                destWeightLimit = (0, getWeightXTokens_1.getWeightXTokens)(new util_1.BN(withWeight), api.tx.xTokens.transfer);
                return [4 /*yield*/, (0, signTx_1.signTx)(api, api.tx.xTokens.transfer(tokenId, amount, destination, destWeightLimit), account, txOptions)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.withdraw = withdraw;

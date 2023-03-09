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
exports.signTx = void 0;
var serialize_1 = require("./utils/serialize");
var getTxNonce_1 = require("./utils/getTxNonce");
var getNonce_1 = require("./methods/rpc/getNonce");
var inMemoryDatabase_1 = require("./utils/inMemoryDatabase");
var truncatedString_1 = require("./utils/truncatedString");
var getTxError_1 = require("./utils/getTxError");
var signTx = function (api, tx, account, txOptions) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var extractedAccount, nonce, error_1, unsub_1, error_2, currentNonce;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            extractedAccount = typeof account === "string" ? account : account.address;
                            return [4 /*yield*/, (0, getTxNonce_1.getTxNonce)(api, extractedAccount, txOptions)];
                        case 1:
                            nonce = _b.sent();
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, tx.signAsync(account, { nonce: nonce, signer: txOptions === null || txOptions === void 0 ? void 0 : txOptions.signer })];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _b.sent();
                            reject(error_1);
                            return [3 /*break*/, 5];
                        case 5:
                            console.info("submitting Tx[".concat(tx.hash.toString(), "]who: ").concat(extractedAccount, " nonce: ").concat(nonce.toString(), " "));
                            _b.label = 6;
                        case 6:
                            _b.trys.push([6, 8, , 10]);
                            return [4 /*yield*/, tx.send(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                                    var inclusionBlockHash, inclusionBlockHeader, inclusionBlockNr, executionBlockStartNr_1, executionBlockStopNr_1, executionBlockNr_1, unsubscribeNewHeads_1, currentNonce;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                console.info("Tx[".concat(tx.hash.toString(), "]who: ").concat(extractedAccount, " nonce: ").concat(nonce.toString(), " => ").concat(result.status.type, "(").concat(result.status.value.toString(), ")").concat((0, serialize_1.serializeTx)(api, tx)));
                                                (_a = txOptions === null || txOptions === void 0 ? void 0 : txOptions.statusCallback) === null || _a === void 0 ? void 0 : _a.call(txOptions, result);
                                                if (!result.status.isInBlock) return [3 /*break*/, 3];
                                                inclusionBlockHash = result.status.asInBlock.toString();
                                                return [4 /*yield*/, api.rpc.chain.getHeader(inclusionBlockHash)];
                                            case 1:
                                                inclusionBlockHeader = _b.sent();
                                                inclusionBlockNr = inclusionBlockHeader.number.toBn();
                                                executionBlockStartNr_1 = inclusionBlockNr.addn(1);
                                                executionBlockStopNr_1 = inclusionBlockNr.addn(10);
                                                executionBlockNr_1 = executionBlockStartNr_1;
                                                return [4 /*yield*/, api.rpc.chain.subscribeNewHeads(function (lastHeader) { return __awaiter(void 0, void 0, void 0, function () {
                                                        var lastBlockNumber, currentNonce, blockHash, blockHeader, extinsics, events, index_1, eventsTriggeredByTx;
                                                        var _a;
                                                        return __generator(this, function (_b) {
                                                            switch (_b.label) {
                                                                case 0:
                                                                    lastBlockNumber = lastHeader.number.toBn();
                                                                    if (!executionBlockNr_1.gt(executionBlockStopNr_1)) return [3 /*break*/, 2];
                                                                    unsubscribeNewHeads_1();
                                                                    reject("Tx([".concat(tx.hash.toString(), "])\n                        was not executed in blocks : ").concat(executionBlockStartNr_1.toString(), "..").concat(executionBlockStopNr_1.toString()));
                                                                    return [4 /*yield*/, (0, getNonce_1.getNonce)(api, extractedAccount)];
                                                                case 1:
                                                                    currentNonce = _b.sent();
                                                                    inMemoryDatabase_1.dbInstance.setNonce(extractedAccount, currentNonce);
                                                                    unsub_1();
                                                                    return [2 /*return*/];
                                                                case 2:
                                                                    if (!lastBlockNumber.gte(executionBlockNr_1)) return [3 /*break*/, 7];
                                                                    return [4 /*yield*/, api.rpc.chain.getBlockHash(executionBlockNr_1)];
                                                                case 3:
                                                                    blockHash = _b.sent();
                                                                    return [4 /*yield*/, api.rpc.chain.getHeader(blockHash)];
                                                                case 4:
                                                                    blockHeader = _b.sent();
                                                                    return [4 /*yield*/, api.rpc.chain.getBlock(blockHeader.hash)];
                                                                case 5:
                                                                    extinsics = (_b.sent()).block.extrinsics;
                                                                    return [4 /*yield*/, api.query.system.events.at(blockHeader.hash)];
                                                                case 6:
                                                                    events = _b.sent();
                                                                    //increment
                                                                    executionBlockNr_1.iaddn(1);
                                                                    index_1 = extinsics.findIndex(function (extrinsic) {
                                                                        return extrinsic.hash.toString() === tx.hash.toString();
                                                                    });
                                                                    if (index_1 < 0) {
                                                                        console.info("Tx([".concat(tx.hash.toString(), "]) not found in block ").concat(executionBlockNr_1, " $([").concat((0, truncatedString_1.truncatedString)(blockHash.toString()), "])"));
                                                                        return [2 /*return*/];
                                                                    }
                                                                    else {
                                                                        unsubscribeNewHeads_1();
                                                                        console.info("Tx[".concat(tx.hash.toString(), "]who:").concat(extractedAccount, " nonce:").concat(nonce.toString(), " => Executed(").concat(blockHash.toString(), ")"));
                                                                    }
                                                                    eventsTriggeredByTx = events
                                                                        .filter(function (currentBlockEvent) {
                                                                        return (currentBlockEvent.phase.isApplyExtrinsic &&
                                                                            currentBlockEvent.phase.asApplyExtrinsic.toNumber() ===
                                                                                index_1);
                                                                    })
                                                                        .map(function (eventRecord) {
                                                                        var event = eventRecord.event, phase = eventRecord.phase;
                                                                        var types = event.typeDef;
                                                                        var eventData = event.data.map(function (d, i) {
                                                                            return {
                                                                                lookupName: types[i].lookupName,
                                                                                data: d
                                                                            };
                                                                        });
                                                                        return {
                                                                            event: event,
                                                                            phase: phase,
                                                                            section: event.section,
                                                                            method: event.method,
                                                                            metaDocumentation: event.meta.docs.toString(),
                                                                            eventData: eventData,
                                                                            error: (0, getTxError_1.getError)(api, event.method, eventData)
                                                                        };
                                                                    });
                                                                    (_a = txOptions === null || txOptions === void 0 ? void 0 : txOptions.extrinsicStatus) === null || _a === void 0 ? void 0 : _a.call(txOptions, eventsTriggeredByTx);
                                                                    resolve(eventsTriggeredByTx);
                                                                    unsub_1();
                                                                    _b.label = 7;
                                                                case 7: return [2 /*return*/];
                                                            }
                                                        });
                                                    }); })];
                                            case 2:
                                                unsubscribeNewHeads_1 = _b.sent();
                                                return [3 /*break*/, 5];
                                            case 3:
                                                if (!result.isError) return [3 /*break*/, 5];
                                                console.info("Transaction Error Result", JSON.stringify(result, null, 2));
                                                reject("Tx([".concat(tx.hash.toString(), "]) Transaction error"));
                                                return [4 /*yield*/, (0, getNonce_1.getNonce)(api, extractedAccount)];
                                            case 4:
                                                currentNonce = _b.sent();
                                                inMemoryDatabase_1.dbInstance.setNonce(extractedAccount, currentNonce);
                                                _b.label = 5;
                                            case 5: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 7:
                            unsub_1 = _b.sent();
                            return [3 /*break*/, 10];
                        case 8:
                            error_2 = _b.sent();
                            return [4 /*yield*/, (0, getNonce_1.getNonce)(api, extractedAccount)];
                        case 9:
                            currentNonce = _b.sent();
                            inMemoryDatabase_1.dbInstance.setNonce(extractedAccount, currentNonce);
                            reject({
                                data: error_2.message ||
                                    error_2.description ||
                                    ((_a = error_2.data) === null || _a === void 0 ? void 0 : _a.toString()) ||
                                    error_2.toString()
                            });
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.signTx = signTx;

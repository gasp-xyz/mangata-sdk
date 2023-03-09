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
var api_1 = require("@polkadot/api");
var types_1 = require("@mangata-finance/types");
var deactivateLiquidity_1 = require("./methods/xyk/deactivateLiquidity");
var activateLiquidity_1 = require("./methods/xyk/activateLiquidity");
var burnLiquidity_1 = require("./methods/xyk/burnLiquidity");
var transferAllTokens_1 = require("./methods/tokens/transferAllTokens");
var transferTokens_1 = require("./methods/tokens/transferTokens");
require("@mangata-finance/types");
var mintLiquidity_1 = require("./methods/xyk/mintLiquidity");
var deposit_1 = require("./methods/xTokens/deposit");
var buyAsset_1 = require("./methods/xyk/buyAsset");
var sellAsset_1 = require("./methods/xyk/sellAsset");
var createPool_1 = require("./methods/xyk/createPool");
var claimRewards_1 = require("./methods/xyk/claimRewards");
var calculateBuyPriceId_1 = require("./methods/rpc/calculateBuyPriceId");
var calculateSellPriceId_1 = require("./methods/rpc/calculateSellPriceId");
var getBurnAmount_1 = require("./methods/rpc/getBurnAmount");
var calculateSellPrice_1 = require("./methods/rpc/calculateSellPrice");
var calculateBuyPrice_1 = require("./methods/rpc/calculateBuyPrice");
var calculateRewardsAmount_1 = require("./methods/rpc/calculateRewardsAmount");
var getNodeVersion_1 = require("./methods/rpc/getNodeVersion");
var getNodeName_1 = require("./methods/rpc/getNodeName");
var getChain_1 = require("./methods/rpc/getChain");
var getPools_1 = require("./methods/query/getPools");
var getPool_1 = require("./methods/query/getPool");
var getLiquidityPool_1 = require("./methods/query/getLiquidityPool");
var getAmountOfTokenIdInPool_1 = require("./methods/query/getAmountOfTokenIdInPool");
var getInvestedPools_1 = require("./methods/query/getInvestedPools");
var getTotalIssuanceOfTokens_1 = require("./methods/query/getTotalIssuanceOfTokens");
var getOwnedTokens_1 = require("./methods/query/getOwnedTokens");
var getAssetsInfo_1 = require("./methods/query/getAssetsInfo");
var getBlockNumber_1 = require("./methods/query/getBlockNumber");
var getLiquidityTokens_1 = require("./methods/query/getLiquidityTokens");
var getLiquidityTokenIds_1 = require("./methods/query/getLiquidityTokenIds");
var getTokenInfo_1 = require("./methods/query/getTokenInfo");
var getTokenBalance_1 = require("./methods/query/getTokenBalance");
var getTotalIssuance_1 = require("./methods/query/getTotalIssuance");
var getLiquidityTokenId_1 = require("./methods/query/getLiquidityTokenId");
var getNonce_1 = require("./methods/query/getNonce");
var withdraw_1 = require("./methods/xTokens/withdraw");
var withdrawKsm_1 = require("./methods/xTokens/withdrawKsm");
var depositKsm_1 = require("./methods/xTokens/depositKsm");
var forTransferAllToken_1 = require("./methods/fee/forTransferAllToken");
var forTransferToken_1 = require("./methods/fee/forTransferToken");
var forBurnLiquidity_1 = require("./methods/fee/forBurnLiquidity");
var forMintLiquidity_1 = require("./methods/fee/forMintLiquidity");
var forBuyAsset_1 = require("./methods/fee/forBuyAsset");
var forSellAsset_1 = require("./methods/fee/forSellAsset");
var forCreatePool_1 = require("./methods/fee/forCreatePool");
var forClaimRewards_1 = require("./methods/fee/forClaimRewards");
var forDeactivateLiquidity_1 = require("./methods/fee/forDeactivateLiquidity");
var forActivateLiquidity_1 = require("./methods/fee/forActivateLiquidity");
var forWithdraw_1 = require("./methods/fee/forWithdraw");
var Mangata;
(function (Mangata) {
    var instanceMap = new Map();
    // The getInstance function returns the instance for a given array of node URLs.
    Mangata.getInstance = function (urls) {
        /**
         * Generate a unique key for the given array of URLs.
         * Sort the URLs alphabetically before creating the key.
         * We want to ensure that the getInstance function only creates one instance
         * for any given array of URLs, regardless of the order of the URLs in the array
         */
        var key = JSON.stringify(urls.sort());
        // Check if an instance already exists for the given URLs.
        if (!instanceMap.has(key)) {
            // Create a new instance using the given URLs.
            var provider = new api_1.WsProvider(urls);
            var instance_1 = api_1.ApiPromise.create((0, types_1.options)({
                provider: provider,
                throwOnConnect: true,
                throwOnUnknown: true,
                noInitWarn: true
            }));
            // Store the instance in the instanceMap.
            instanceMap.set(key, instance_1);
        }
        // Return the instance in a Promise.
        var instance = instanceMap.get(key);
        return {
            fee: {
                withdraw: function (args) { return (0, forWithdraw_1.forWithdraw)(instance, args); },
                activateLiquidity: function (args) {
                    return (0, forActivateLiquidity_1.forActivateLiquidity)(instance, args);
                },
                deactivateLiquidity: function (args) {
                    return (0, forDeactivateLiquidity_1.forDeactivateLiquidity)(instance, args);
                },
                claimRewards: function (args) {
                    return (0, forClaimRewards_1.forClaimRewards)(instance, args);
                },
                createPool: function (args) { return (0, forCreatePool_1.forCreatePool)(instance, args); },
                sellAsset: function (args) { return (0, forSellAsset_1.forSellAsset)(instance, args); },
                buyAsset: function (args) { return (0, forBuyAsset_1.forBuyAsset)(instance, args); },
                mintLiquidity: function (args) {
                    return (0, forMintLiquidity_1.forMintLiquidity)(instance, args);
                },
                burnLiquidity: function (args) {
                    return (0, forBurnLiquidity_1.forBurnLiquidity)(instance, args);
                },
                transferAllToken: function (args) {
                    return (0, forTransferAllToken_1.forTransferAllToken)(instance, args);
                },
                transferToken: function (args) {
                    return (0, forTransferToken_1.forTransferToken)(instance, args);
                }
            },
            query: {
                getNonce: function (address) { return (0, getNonce_1.getNonce)(instance, address); },
                getLiquidityTokenId: function (firstTokenId, secondTokenId) {
                    return (0, getLiquidityTokenId_1.getLiquidityTokenId)(instance, firstTokenId, secondTokenId);
                },
                getTotalIssuance: function (tokenId) {
                    return (0, getTotalIssuance_1.getTotalIssuance)(instance, tokenId);
                },
                getTokenBalance: function (address, tokenId) {
                    return (0, getTokenBalance_1.getTokenBalance)(instance, address, tokenId);
                },
                getTokenInfo: function (tokenId) { return (0, getTokenInfo_1.getTokenInfo)(instance, tokenId); },
                getLiquidityTokenIds: function () { return (0, getLiquidityTokenIds_1.getLiquidityTokenIds)(instance); },
                getLiquidityTokens: function () { return (0, getLiquidityTokens_1.getLiquidityTokens)(instance); },
                getBlockNumber: function () { return (0, getBlockNumber_1.getBlockNumber)(instance); },
                getOwnedTokens: function (address) { return (0, getOwnedTokens_1.getOwnedTokens)(instance, address); },
                getAssetsInfo: function () { return (0, getAssetsInfo_1.getAssetsInfo)(instance); },
                getInvestedPools: function (address) {
                    return (0, getInvestedPools_1.getInvestedPools)(instance, address);
                },
                getAmountOfTokenIdInPool: function (firstTokenId, secondTokenId) { return (0, getAmountOfTokenIdInPool_1.getAmountOfTokenIdInPool)(instance, firstTokenId, secondTokenId); },
                getLiquidityPool: function (liquidityTokenId) {
                    return (0, getLiquidityPool_1.getLiquidityPool)(instance, liquidityTokenId);
                },
                getPool: function (liquidityTokenId) {
                    return (0, getPool_1.getPool)(instance, liquidityTokenId);
                },
                getPools: function () { return (0, getPools_1.getPools)(instance); },
                getTotalIssuanceOfTokens: function () { return (0, getTotalIssuanceOfTokens_1.getTotalIssuanceOfTokens)(instance); }
            },
            rpc: {
                calculateBuyPriceId: function (args) {
                    return (0, calculateBuyPriceId_1.calculateBuyPriceId)(instance, args);
                },
                calculateSellPriceId: function (args) {
                    return (0, calculateSellPriceId_1.calculateSellPriceId)(instance, args);
                },
                getBurnAmount: function (args) { return (0, getBurnAmount_1.getBurnAmount)(instance, args); },
                calculateSellPrice: function (args) {
                    return (0, calculateSellPrice_1.calculateSellPrice)(instance, args);
                },
                calculateBuyPrice: function (args) { return (0, calculateBuyPrice_1.calculateBuyPrice)(instance, args); },
                calculateRewardsAmount: function (args) {
                    return (0, calculateRewardsAmount_1.calculateRewardsAmount)(instance, args);
                },
                getNodeVersion: function () { return (0, getNodeVersion_1.getNodeVersion)(instance); },
                getNodeName: function () { return (0, getNodeName_1.getNodeName)(instance); },
                getChain: function () { return (0, getChain_1.getChain)(instance); }
            },
            xyk: {
                deactivateLiquidity: function (args) {
                    return (0, deactivateLiquidity_1.deactivateLiquidity)(instance, args);
                },
                activateLiquidity: function (args) {
                    return (0, activateLiquidity_1.activateLiquidity)(instance, args);
                },
                burnLiquidity: function (args) { return (0, burnLiquidity_1.burnLiquidity)(instance, args); },
                mintLiquidity: function (args) { return (0, mintLiquidity_1.mintLiquidity)(instance, args); },
                buyAsset: function (args) { return (0, buyAsset_1.buyAsset)(instance, args); },
                sellAsset: function (args) { return (0, sellAsset_1.sellAsset)(instance, args); },
                createPool: function (args) { return (0, createPool_1.createPool)(instance, args); },
                claimRewards: function (args) { return (0, claimRewards_1.claimRewards)(instance, args); }
            },
            tokens: {
                transferAllTokens: function (args) {
                    return (0, transferAllTokens_1.transferAllTokens)(instance, args);
                },
                transferTokens: function (args) {
                    return (0, transferTokens_1.transferTokens)(instance, args);
                }
            },
            xTokens: {
                deposit: function (args) { return (0, deposit_1.deposit)(args); },
                depositKsm: function (args) { return (0, depositKsm_1.depositKsm)(args); },
                withdraw: function (args) { return (0, withdraw_1.withdraw)(instance, args); },
                withdrawKsm: function (args) { return (0, withdrawKsm_1.withdrawKsm)(instance, args); }
            }
        };
    };
})(Mangata || (Mangata = {}));
function testSingleton() {
    return __awaiter(this, void 0, void 0, function () {
        var urls, instance, pool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urls = [
                        "wss://mangata-x.api.onfinality.io/public-ws",
                        "wss://prod-kusama-collator-01.mangatafinance.cloud"
                    ];
                    instance = Mangata.getInstance(urls);
                    return [4 /*yield*/, instance.query.getInvestedPools("5GBrzxeB3N4VwQFGMpgh518Jp7QzfgbNog8YBe96dDwx3c1x")];
                case 1:
                    pool = _a.sent();
                    console.log(pool);
                    return [2 /*return*/];
            }
        });
    });
}
testSingleton();

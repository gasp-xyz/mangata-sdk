import { ApiPromise } from "@polkadot/api";
import { WsProvider } from "@polkadot/rpc-provider/ws";
import { options } from "@mangata-finance/types";
import { Rpc } from "./services/Rpc";
import { Tx } from "./services/Tx";
import { Query } from "./services/Query";
import { Fee } from "./services/Fee";
import { calculateFutureRewardsAmountForMinting } from "./utils/calculateFutureRewardsAmount";
/**
 * @class Mangata
 * @author Mangata Finance
 * The Mangata class defines the `getInstance` method that lets clients access the unique singleton instance.
 */
export class Mangata {
    api;
    urls;
    static instanceMap = new Map();
    /**
     * The Mangata's constructor is private to prevent direct
     * construction calls with the `new` operator.
     */
    constructor(urls) {
        this.urls = urls;
        this.api = (async () => {
            const api = await this.connectToNode(urls);
            return api;
        })();
    }
    /**
     * Initialised via create method with proper types and rpc
     * for Mangata
     */
    async connectToNode(urls) {
        const provider = new WsProvider(urls, 5000);
        const api = await ApiPromise.create(options({
            provider,
            throwOnConnect: true,
            throwOnUnknown: true,
            noInitWarn: true
        }));
        return api;
    }
    /**
     * The static method that controls the access to the Mangata instance.
     */
    static getInstance(urls) {
        if (!Mangata.instanceMap.has(JSON.stringify(urls))) {
            Mangata.instanceMap.set(JSON.stringify(urls), new Mangata(urls));
            return Mangata.instanceMap.get(JSON.stringify(urls));
        }
        else {
            return Mangata.instanceMap.get(JSON.stringify(urls));
        }
    }
    /**
     * Api instance of the connected node
     */
    async getApi() {
        // Because we assign this.api synchronously, repeated calls to
        // method() are guaranteed to always reuse the same promise.
        if (!this.api) {
            this.api = this.connectToNode(this.urls);
        }
        return this.api;
    }
    /**
     * Uri of the connected node
     */
    getUrls() {
        return this.urls;
    }
    /**
     * Wait for the new block
     * (by default 2) - Do not use blockCount = 1 it gives an error
     * when executing transactions
     * @param {number} blockCount - The block number to wait for
     */
    async waitForNewBlock(blockCount) {
        let count = 0;
        const api = await this.getApi();
        const numberOfBlocks = blockCount || 2;
        return new Promise(async (resolve) => {
            const unsubscribe = await api.rpc.chain.subscribeNewHeads(() => {
                if (++count === numberOfBlocks) {
                    unsubscribe();
                    resolve(true);
                }
            });
        });
    }
    /**
     * Chain name of the connected node
     */
    async getChain() {
        const api = await this.getApi();
        return Rpc.getChain(api);
    }
    /**
     * Node name of the connected node
     */
    async getNodeName() {
        const api = await this.getApi();
        return Rpc.getNodeName(api);
    }
    /**
     * Node version of the connected node
     */
    async getNodeVersion() {
        const api = await this.getApi();
        return Rpc.getNodeVersion(api);
    }
    /**
     * Get the current nonce of the account
     */
    async getNonce(address) {
        const api = await this.getApi();
        return Query.getNonce(api, address);
    }
    /**
     * Disconnect from the node
     */
    async disconnect() {
        const api = await this.getApi();
        await api.disconnect();
    }
    async sendTokenFromStatemineToMangata(url, tokenSymbol, destWeight, account, mangataAddress, amount, txOptions) {
        const api = await this.getApi();
        return await Tx.sendTokenFromStatemineToMangata(api, url, tokenSymbol, destWeight, account, mangataAddress, amount, txOptions);
    }
    async sendTokenFromParachainToMangata(url, tokenSymbol, destWeight, account, mangataAddress, amount, txOptions) {
        const api = await this.getApi();
        return await Tx.sendTokenFromParachainToMangata(api, url, tokenSymbol, destWeight, account, mangataAddress, amount, txOptions);
    }
    async sendTokenFromMangataToParachain(tokenSymbol, withWeight, parachainId, account, destinationAddress, amount, txOptions) {
        const api = await this.getApi();
        return await Tx.sendTokenFromMangataToParachain(api, tokenSymbol, withWeight, parachainId, account, destinationAddress, amount, txOptions);
    }
    async sendTokenFromParachainToMangataFee(url, tokenSymbol, destWeight, account, mangataAddress, amount) {
        const api = await this.getApi();
        return await Fee.sendTokenFromParachainToMangataFee(api, url, tokenSymbol, destWeight, account, mangataAddress, amount);
    }
    async sendTokenFromMangataToParachainFee(tokenSymbol, withWeight, parachainId, account, destinationAddress, amount) {
        const api = await this.getApi();
        return await Fee.sendTokenFromMangataToParachainFee(api, tokenSymbol, withWeight, parachainId, account, destinationAddress, amount);
    }
    async sendKusamaTokenFromRelayToParachain(kusamaEndpointUrl, ksmAccount, destinationMangataAddress, amount, parachainId = 2110, txOptions) {
        return await Tx.sendKusamaTokenFromRelayToParachain(kusamaEndpointUrl, ksmAccount, destinationMangataAddress, amount, parachainId, txOptions);
    }
    async sendKusamaTokenFromRelayToParachainFee(kusamaEndpointUrl, ksmAccount, destinationMangataAddress, amount, parachainId = 2110) {
        return await Fee.sendKusamaTokenFromRelayToParachainFee(kusamaEndpointUrl, ksmAccount, destinationMangataAddress, amount, parachainId);
    }
    async sendKusamaTokenFromParachainToRelay(mangataAccount, destinationKusamaAddress, amount, txOptions) {
        const api = await this.getApi();
        return await Tx.sendKusamaTokenFromParachainToRelay(api, mangataAccount, destinationKusamaAddress, amount, txOptions);
    }
    async sendKusamaTokenFromParachainToRelayFee(mangataAccount, destinationKusamaAddress, amount) {
        const api = await this.getApi();
        return await Fee.sendKusamaTokenFromParachainToRelayFee(api, mangataAccount, destinationKusamaAddress, amount);
    }
    /**
     * @deprecated Please use sendTokenFromParachainToMangata
     */
    async sendTurTokenFromTuringToMangata(turingUrl, account, mangataAddress, amount, txOptions) {
        const api = await this.getApi();
        return await Tx.sendTurTokenFromTuringToMangata(api, turingUrl, account, mangataAddress, amount, txOptions);
    }
    /**
     * @deprecated Please use sendTokenFromMangataToParachain
     */
    async sendTurTokenFromMangataToTuring(mangataAccount, destinationAddress, amount, txOptions) {
        const api = await this.getApi();
        return await Tx.sendTurTokenFromMangataToTuring(api, mangataAccount, destinationAddress, amount, txOptions);
    }
    /**
     * @deprecated Please use sendTokenFromParachainToMangataFee
     */
    async sendTurTokenFromTuringToMangataFee(turingUrl, account, mangataAddress, amount) {
        const api = await this.getApi();
        return await Fee.sendTurTokenFromTuringToMangataFee(api, turingUrl, account, mangataAddress, amount);
    }
    /**
     * @deprecated Please use sendTokenFromMangataToParachainFee
     */
    async sendTurTokenFromMangataToTuringFee(mangataAccount, destinationAddress, amount) {
        const api = await this.getApi();
        return await Fee.sendTurTokenFromMangataToTuringFee(api, mangataAccount, destinationAddress, amount);
    }
    async activateLiquidity(account, liquditityTokenId, amount, txOptions) {
        const api = await this.getApi();
        return await Tx.activateLiquidity(api, account, liquditityTokenId, amount, txOptions);
    }
    async deactivateLiquidity(account, liquditityTokenId, amount, txOptions) {
        const api = await this.getApi();
        return await Tx.deactivateLiquidity(api, account, liquditityTokenId, amount, txOptions);
    }
    async calculateFutureRewardsAmountForMinting(liquidityTokenId, mintingAmount, blocksToPass) {
        const api = await this.getApi();
        return await calculateFutureRewardsAmountForMinting(api, liquidityTokenId, mintingAmount, blocksToPass);
    }
    async calculateRewardsAmount(address, liquidityTokenId) {
        const api = await this.getApi();
        return await Rpc.calculateRewardsAmount(api, address, liquidityTokenId);
    }
    async claimRewardsFee(account, liquditityTokenId, amount) {
        const api = await this.getApi();
        return await Fee.claimRewardsFee(api, account, liquditityTokenId, amount);
    }
    async claimRewards(account, liquditityTokenId, amount, txOptions) {
        const api = await this.getApi();
        return await Tx.claimRewards(api, account, liquditityTokenId, amount, txOptions);
    }
    async createPoolFee(account, firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount) {
        const api = await this.getApi();
        return await Fee.createPoolFee(api, account, firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount);
    }
    /**
     * Extrinsic to create pool
     * @param {string | Keyringpair} account
     * @param {string} firstTokenId
     * @param {BN} firstTokenAmount
     * @param {string} secondTokenId
     * @param {BN} secondTokenAmount
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async createPool(account, firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount, txOptions) {
        const api = await this.getApi();
        return await Tx.createPool(api, account, firstTokenId, firstTokenAmount, secondTokenId, secondTokenAmount, txOptions);
    }
    async sellAssetFee(account, soldAssetId, boughtAssetId, amount, minAmountOut) {
        const api = await this.getApi();
        return await Fee.sellAssetFee(api, account, soldAssetId, boughtAssetId, amount, minAmountOut);
    }
    /**
     * Extrinsic to sell/swap sold token id in sold token amount for bought token id,
     * while specifying min amount out: minimal expected bought token amount
     *
     * @param {string | Keyringpair} account
     * @param {string} soldAssetId
     * @param {string} boughtAssetId
     * @param {BN} amount
     * @param {BN} minAmountOut
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async sellAsset(account, soldAssetId, boughtAssetId, amount, minAmountOut, txOptions) {
        const api = await this.getApi();
        return await Tx.sellAsset(api, account, soldAssetId, boughtAssetId, amount, minAmountOut, txOptions);
    }
    async mintLiquidityFee(account, firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount) {
        const api = await this.getApi();
        return await Fee.mintLiquidityFee(api, account, firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount);
    }
    /**
     * Extrinsic to add liquidity to pool, while specifying first token id
     * and second token id and first token amount. Second token amount is calculated in block, * but cannot exceed expected second token amount
     *
     * @param {string | Keyringpair} account
     * @param {string} firstTokenId
     * @param {string} secondTokenId
     * @param {BN} firstTokenAmount
     * @param {BN} expectedSecondTokenAmount
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async mintLiquidity(account, firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount, txOptions) {
        const api = await this.getApi();
        return await Tx.mintLiquidity(api, account, firstTokenId, secondTokenId, firstTokenAmount, expectedSecondTokenAmount, txOptions);
    }
    async burnLiquidityFee(account, firstTokenId, secondTokenId, liquidityTokenAmount) {
        const api = await this.getApi();
        return await Fee.burnLiquidityFee(api, account, firstTokenId, secondTokenId, liquidityTokenAmount);
    }
    /**
     * Extrinsic to remove liquidity from liquidity pool, specifying first token id and
     * second token id of a pool and liquidity token amount you wish to burn
     *
     * @param {string | Keyringpair} account
     * @param {string} firstTokenId
     * @param {string} secondTokenId
     * @param {BN} liquidityTokenAmount
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async burnLiquidity(account, firstTokenId, secondTokenId, liquidityTokenAmount, txOptions) {
        const api = await this.getApi();
        return await Tx.burnLiquidity(api, account, firstTokenId, secondTokenId, liquidityTokenAmount, txOptions);
    }
    async buyAssetFee(account, soldAssetId, boughtAssetId, amount, maxAmountIn) {
        const api = await this.getApi();
        return await Fee.buyAssetFee(api, account, soldAssetId, boughtAssetId, amount, maxAmountIn);
    }
    /**
     * Extrinsic to buy/swap bought token id in bought token amount for sold token id, while
     * specifying max amount in: maximal amount you are willing to pay in sold token id to
     * purchase bought token id in bought token amount.
     *
     * @param {string | Keyringpair} account
     * @param {string} soldAssetId
     * @param {string} boughtAssetId
     * @param {BN} amount
     * @param {BN} maxAmountIn
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async buyAsset(account, soldAssetId, boughtAssetId, amount, maxAmountIn, txOptions) {
        const api = await this.getApi();
        return await Tx.buyAsset(api, account, soldAssetId, boughtAssetId, amount, maxAmountIn, txOptions);
    }
    /**
     * Returns sell amount you need to pay in sold token id for bought token id in buy
     * amount, while specifying input reserve – reserve of sold token id, and output reserve
     * – reserve of bought token id
     *
     * @param {BN} inputReserve
     * @param {BN} outputReserve
     * @param {BN} buyAmount
     *
     * @returns {BN}
     */
    async calculateBuyPrice(inputReserve, outputReserve, buyAmount) {
        const api = await this.getApi();
        return await Rpc.calculateBuyPrice(api, inputReserve, outputReserve, buyAmount);
    }
    /**
     * Returns bought token amount returned by selling sold token id for bought token id in
     * sell amount, while specifying input reserve – reserve of sold token id, and output
     * reserve – reserve of bought token id
     *
     * @param {BN} inputReserve
     * @param {BN} outputReserve
     * @param {BN} sellAmount
     *
     * @returns {BN}
     */
    async calculateSellPrice(inputReserve, outputReserve, sellAmount) {
        const api = await this.getApi();
        return await Rpc.calculateSellPrice(api, inputReserve, outputReserve, sellAmount);
    }
    /**
     * Returns bought token amount returned by selling sold token id for bought token id in
     * sell amount, while specifying input reserve – reserve of sold token id, and output
     * reserve – reserve of bought token id
     *
     * @param {BN} inputReserve
     * @param {BN} outputReserve
     * @param {BN} sellAmount
     *
     * @returns {BN}
     */
    async getBurnAmount(firstTokenId, secondTokenId, liquidityAssetAmount) {
        const api = await this.getApi();
        return await Rpc.getBurnAmount(api, firstTokenId, secondTokenId, liquidityAssetAmount);
    }
    /**
     * Returns bought asset amount returned by selling sold token id for bought token id in
     * sell amount
     *
     * @param {string} soldTokenId
     * @param {string} boughtTokenId
     * @param {BN} sellAmount
     *
     * @returns {BN}
     */
    async calculateSellPriceId(soldTokenId, boughtTokenId, sellAmount) {
        const api = await this.getApi();
        return await Rpc.calculateSellPriceId(api, soldTokenId, boughtTokenId, sellAmount);
    }
    /**
     * Returns sell amount you need to pay in sold token id for bought token id in buy amount
     *
     * @param {string} soldTokenId
     * @param {string} boughtTokenId
     * @param {BN} buyAmount
     *
     * @returns {BN}
     *
     */
    async calculateBuyPriceId(soldTokenId, boughtTokenId, buyAmount) {
        const api = await this.getApi();
        return await Rpc.calculateBuyPriceId(api, soldTokenId, boughtTokenId, buyAmount);
    }
    /**
     * Returns amount of token ids in pool.
     *
     * @param {string} firstTokenId
     * @param {string} secondTokenId
     *
     * @returns {BN | Array}
     */
    async getAmountOfTokenIdInPool(firstTokenId, secondTokenId) {
        const api = await this.getApi();
        return await Query.getAmountOfTokenIdInPool(api, firstTokenId, secondTokenId);
    }
    /**
     * Returns liquidity asset id while specifying first and second Token Id.
     * Returns same liquidity asset id when specifying other way
     * around – second and first Token Id
     *
     * @param {string} firstTokenId
     * @param {string} secondTokenId
     *
     * @returns {BN}
     */
    async getLiquidityTokenId(firstTokenId, secondTokenId) {
        const api = await this.getApi();
        return await Query.getLiquidityTokenId(api, firstTokenId, secondTokenId);
    }
    /**
     * Returns pool corresponding to specified liquidity asset ID
     * @param {string} liquidityAssetId
     *
     * @returns {BN | Array}
     */
    async getLiquidityPool(liquidityAssetId) {
        const api = await this.getApi();
        return await Query.getLiquidityPool(api, liquidityAssetId);
    }
    async transferTokenFee(account, tokenId, address, amount) {
        const api = await this.getApi();
        return await Fee.transferTokenFee(api, account, tokenId, address, amount);
    }
    /**
     * Extrinsic that transfers Token Id in value amount from origin to destination
     * @param {string | Keyringpair} account
     * @param {string} tokenId
     * @param {string} address
     * @param {BN} amount
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async transferToken(account, tokenId, address, amount, txOptions) {
        const api = await this.getApi();
        const result = await Tx.transferToken(api, account, tokenId, address, amount, txOptions);
        return result;
    }
    async transferTokenAllFee(account, tokenId, address) {
        const api = await this.getApi();
        return await Fee.transferAllTokenFee(api, account, tokenId, address);
    }
    /**
     * Extrinsic that transfers all token Id from origin to destination
     * @param {string | Keyringpair} account
     * @param {string} tokenId
     * @param {string} address
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    async transferTokenAll(account, tokenId, address, txOptions) {
        const api = await this.getApi();
        return await Tx.transferAllToken(api, account, tokenId, address, txOptions);
    }
    /**
     * Returns total issuance of Token Id
     * @param {string} tokenId
     *
     * @returns {BN}
     */
    async getTotalIssuance(tokenId) {
        const api = await this.getApi();
        return await Query.getTotalIssuance(api, tokenId);
    }
    /**
     * Returns token balance for address
     * @param {string} tokenId
     * @param {string} address
     *
     * @returns {TokenBalance}
     */
    async getTokenBalance(tokenId, address) {
        const api = await this.getApi();
        return await Query.getTokenBalance(api, address, tokenId);
    }
    /**
     * Returns next CurencyId, CurrencyId that will be used for next created token
     */
    async getNextTokenId() {
        const api = await this.getApi();
        return await Query.getNextTokenId(api);
    }
    /**
     * Returns token info
     * @param {string} tokenId
     */
    async getTokenInfo(tokenId) {
        const api = await this.getApi();
        return await Query.getTokenInfo(api, tokenId);
    }
    async getBlockNumber() {
        const api = await this.getApi();
        return await Query.getBlockNumber(api);
    }
    async getOwnedTokens(address) {
        const api = await this.getApi();
        return await Query.getOwnedTokens(api, address);
    }
    /**
     * Returns liquditity token Ids
     * @returns {string | Array}
     */
    async getLiquidityTokenIds() {
        const api = await this.getApi();
        return await Query.getLiquidityTokenIds(api);
    }
    /**
     * Returns info about all assets
     */
    async getAssetsInfo() {
        const api = await this.getApi();
        return await Query.getAssetsInfo(api);
    }
    async getBalances() {
        const api = await this.getApi();
        return await Query.getBalances(api);
    }
    async getLiquidityTokens() {
        const api = await this.getApi();
        return await Query.getLiquidityTokens(api);
    }
    async getPool(liquditityTokenId) {
        const api = await this.getApi();
        return await Query.getPool(api, liquditityTokenId);
    }
    async getInvestedPools(address) {
        const api = await this.getApi();
        return await Query.getInvestedPools(api, address);
    }
    async getPools() {
        const api = await this.getApi();
        return await Query.getPools(api);
    }
}

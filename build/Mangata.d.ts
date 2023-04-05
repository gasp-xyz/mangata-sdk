/// <reference types="bn.js" />
import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { BN } from "@polkadot/util";
import { TTokenAddress, TToken, TBalances, TMainTokens, TokenBalance, TTokenId, TPoolWithShare, TPoolWithRatio } from "./types/AssetInfo";
import { MangataGenericEvent } from "./types/MangataGenericEvent";
import { TxOptions, XcmTxOptions } from "./types/TxOptions";
/**
 * @class Mangata
 * @author Mangata Finance
 * The Mangata class defines the `getInstance` method that lets clients access the unique singleton instance.
 */
export declare class Mangata {
    private api;
    private urls;
    private static instanceMap;
    /**
     * The Mangata's constructor is private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor();
    /**
     * Initialised via create method with proper types and rpc
     * for Mangata
     */
    private connectToNode;
    /**
     * The static method that controls the access to the Mangata instance.
     */
    static getInstance(urls: string[]): Mangata;
    /**
     * Api instance of the connected node
     */
    getApi(): Promise<ApiPromise>;
    /**
     * Uri of the connected node
     */
    getUrls(): string[];
    /**
     * Wait for the new block
     * (by default 2) - Do not use blockCount = 1 it gives an error
     * when executing transactions
     * @param {number} blockCount - The block number to wait for
     */
    waitForNewBlock(blockCount?: number): Promise<boolean>;
    /**
     * Chain name of the connected node
     */
    getChain(): Promise<string>;
    /**
     * Node name of the connected node
     */
    getNodeName(): Promise<string>;
    /**
     * Node version of the connected node
     */
    getNodeVersion(): Promise<string>;
    /**
     * Get the current nonce of the account
     */
    getNonce(address: TTokenAddress): Promise<BN>;
    /**
     * Disconnect from the node
     */
    disconnect(): Promise<void>;
    sendTokenFromStatemineToMangata(url: string, tokenSymbol: string, destWeight: string, account: string | KeyringPair, mangataAddress: string, amount: BN, txOptions?: XcmTxOptions): Promise<void>;
    sendTokenFromParachainToMangata(url: string, tokenSymbol: string, destWeight: string, account: string | KeyringPair, mangataAddress: string, amount: BN, txOptions?: XcmTxOptions): Promise<void>;
    sendTokenFromMangataToParachain(tokenSymbol: string, withWeight: string, parachainId: number, account: string | KeyringPair, destinationAddress: string, amount: BN, txOptions?: XcmTxOptions): Promise<void>;
    sendTokenFromParachainToMangataFee(url: string, tokenSymbol: string, destWeight: string, account: string | KeyringPair, mangataAddress: string, amount: BN): Promise<string>;
    sendTokenFromMangataToParachainFee(tokenSymbol: string, withWeight: string, parachainId: number, account: string | KeyringPair, destinationAddress: string, amount: BN): Promise<string>;
    sendKusamaTokenFromRelayToParachain(kusamaEndpointUrl: string, ksmAccount: string | KeyringPair, destinationMangataAddress: string, amount: BN, parachainId?: number, txOptions?: XcmTxOptions): Promise<void>;
    sendKusamaTokenFromRelayToParachainFee(kusamaEndpointUrl: string, ksmAccount: string | KeyringPair, destinationMangataAddress: string, amount: BN, parachainId?: number): Promise<string>;
    sendKusamaTokenFromParachainToRelay(mangataAccount: string | KeyringPair, destinationKusamaAddress: string, amount: BN, txOptions?: XcmTxOptions): Promise<void>;
    sendKusamaTokenFromParachainToRelayFee(mangataAccount: string | KeyringPair, destinationKusamaAddress: string, amount: BN): Promise<string>;
    /**
     * @deprecated Please use sendTokenFromParachainToMangata
     */
    sendTurTokenFromTuringToMangata(turingUrl: string, account: string | KeyringPair, mangataAddress: string, amount: BN, txOptions?: XcmTxOptions): Promise<void>;
    /**
     * @deprecated Please use sendTokenFromMangataToParachain
     */
    sendTurTokenFromMangataToTuring(mangataAccount: string | KeyringPair, destinationAddress: string, amount: BN, txOptions?: XcmTxOptions): Promise<void>;
    /**
     * @deprecated Please use sendTokenFromParachainToMangataFee
     */
    sendTurTokenFromTuringToMangataFee(turingUrl: string, account: string | KeyringPair, mangataAddress: string, amount: BN): Promise<string>;
    /**
     * @deprecated Please use sendTokenFromMangataToParachainFee
     */
    sendTurTokenFromMangataToTuringFee(mangataAccount: string | KeyringPair, destinationAddress: string, amount: BN): Promise<string>;
    activateLiquidity(account: string | KeyringPair, liquditityTokenId: string, amount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    deactivateLiquidity(account: string | KeyringPair, liquditityTokenId: string, amount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    calculateFutureRewardsAmountForMinting(liquidityTokenId: string, mintingAmount: BN, blocksToPass: BN): Promise<BN>;
    calculateRewardsAmount(address: string, liquidityTokenId: string): Promise<BN>;
    claimRewardsFee(account: string | KeyringPair, liquditityTokenId: string, amount: BN): Promise<string>;
    claimRewards(account: string | KeyringPair, liquditityTokenId: string, amount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    createPoolFee(account: string | KeyringPair, firstTokenId: string, firstTokenAmount: BN, secondTokenId: string, secondTokenAmount: BN): Promise<string>;
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
    createPool(account: string | KeyringPair, firstTokenId: string, firstTokenAmount: BN, secondTokenId: string, secondTokenAmount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    sellAssetFee(account: string | KeyringPair, soldAssetId: string, boughtAssetId: string, amount: BN, minAmountOut: BN): Promise<string>;
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
    sellAsset(account: string | KeyringPair, soldAssetId: string, boughtAssetId: string, amount: BN, minAmountOut: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    mintLiquidityFee(account: string | KeyringPair, firstTokenId: string, secondTokenId: string, firstTokenAmount: BN, expectedSecondTokenAmount: BN): Promise<string>;
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
    mintLiquidity(account: string | KeyringPair, firstTokenId: string, secondTokenId: string, firstTokenAmount: BN, expectedSecondTokenAmount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    burnLiquidityFee(account: string | KeyringPair, firstTokenId: string, secondTokenId: string, liquidityTokenAmount: BN): Promise<string>;
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
    burnLiquidity(account: string | KeyringPair, firstTokenId: string, secondTokenId: string, liquidityTokenAmount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    buyAssetFee(account: string | KeyringPair, soldAssetId: string, boughtAssetId: string, amount: BN, maxAmountIn: BN): Promise<string>;
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
    buyAsset(account: string | KeyringPair, soldAssetId: string, boughtAssetId: string, amount: BN, maxAmountIn: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
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
    calculateBuyPrice(inputReserve: BN, outputReserve: BN, buyAmount: BN): Promise<BN>;
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
    calculateSellPrice(inputReserve: BN, outputReserve: BN, sellAmount: BN): Promise<BN>;
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
    getBurnAmount(firstTokenId: string, secondTokenId: string, liquidityAssetAmount: BN): Promise<any>;
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
    calculateSellPriceId(soldTokenId: string, boughtTokenId: string, sellAmount: BN): Promise<BN>;
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
    calculateBuyPriceId(soldTokenId: string, boughtTokenId: string, buyAmount: BN): Promise<BN>;
    /**
     * Returns amount of token ids in pool.
     *
     * @param {string} firstTokenId
     * @param {string} secondTokenId
     *
     * @returns {BN | Array}
     */
    getAmountOfTokenIdInPool(firstTokenId: TTokenId, secondTokenId: TTokenId): Promise<BN[]>;
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
    getLiquidityTokenId(firstTokenId: TTokenId, secondTokenId: TTokenId): Promise<BN>;
    /**
     * Returns pool corresponding to specified liquidity asset ID
     * @param {string} liquidityAssetId
     *
     * @returns {BN | Array}
     */
    getLiquidityPool(liquidityAssetId: string): Promise<BN[]>;
    transferTokenFee(account: string | KeyringPair, tokenId: string, address: string, amount: BN): Promise<string>;
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
    transferToken(account: string | KeyringPair, tokenId: string, address: string, amount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    transferTokenAllFee(account: string | KeyringPair, tokenId: string, address: string): Promise<string>;
    /**
     * Extrinsic that transfers all token Id from origin to destination
     * @param {string | Keyringpair} account
     * @param {string} tokenId
     * @param {string} address
     * @param {TxOptions} [txOptions]
     *
     * @returns {(MangataGenericEvent|Array)}
     */
    transferTokenAll(account: string | KeyringPair, tokenId: string, address: string, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    /**
     * Returns total issuance of Token Id
     * @param {string} tokenId
     *
     * @returns {BN}
     */
    getTotalIssuance(tokenId: string): Promise<BN>;
    /**
     * Returns token balance for address
     * @param {string} tokenId
     * @param {string} address
     *
     * @returns {TokenBalance}
     */
    getTokenBalance(tokenId: string, address: string): Promise<TokenBalance>;
    /**
     * Returns next CurencyId, CurrencyId that will be used for next created token
     */
    getNextTokenId(): Promise<BN>;
    /**
     * Returns token info
     * @param {string} tokenId
     */
    getTokenInfo(tokenId: string): Promise<import("./types/AssetInfo").TTokenInfo>;
    getBlockNumber(): Promise<string>;
    getOwnedTokens(address: string): Promise<Record<TTokenId, TToken> | null>;
    /**
     * Returns liquditity token Ids
     * @returns {string | Array}
     */
    getLiquidityTokenIds(): Promise<string[]>;
    /**
     * Returns info about all assets
     */
    getAssetsInfo(): Promise<TMainTokens>;
    getBalances(): Promise<TBalances>;
    getLiquidityTokens(): Promise<TMainTokens>;
    getPool(liquditityTokenId: TTokenId): Promise<TPoolWithRatio>;
    getInvestedPools(address: string): Promise<TPoolWithShare[]>;
    getPools(): Promise<TPoolWithRatio[]>;
}
//# sourceMappingURL=Mangata.d.ts.map
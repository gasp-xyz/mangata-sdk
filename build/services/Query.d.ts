/// <reference types="bn.js" />
import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TToken, TTokenInfo, TBalances, TMainTokens, TokenBalance, TPool, TTokenAddress, TTokenId, TPoolWithRatio } from "../types/AssetInfo";
export declare class Query {
    static getNonce(api: ApiPromise, address: TTokenAddress): Promise<BN>;
    static getAmountOfTokenIdInPool(api: ApiPromise, firstTokenId: TTokenId, secondTokenId: TTokenId): Promise<BN[]>;
    static getLiquidityTokenId(api: ApiPromise, firstTokenId: TTokenId, secondTokenId: TTokenId): Promise<BN>;
    static getLiquidityPool(api: ApiPromise, liquidityTokenId: TTokenId): Promise<BN[]>;
    static getTotalIssuance(api: ApiPromise, tokenId: TTokenId): Promise<BN>;
    static getTokenBalance(api: ApiPromise, address: TTokenAddress, tokenId: TTokenId): Promise<TokenBalance>;
    static getNextTokenId(api: ApiPromise): Promise<BN>;
    static getTokenInfo(api: ApiPromise, tokenId: TTokenId): Promise<TTokenInfo>;
    static getLiquidityTokenIds(api: ApiPromise): Promise<TTokenId[]>;
    static getLiquidityTokens(api: ApiPromise): Promise<TMainTokens>;
    static getAssetsInfo(api: ApiPromise): Promise<TMainTokens>;
    static getBlockNumber(api: ApiPromise): Promise<string>;
    static getOwnedTokens(api: ApiPromise, address: string): Promise<{
        [id: TTokenId]: TToken;
    } | null>;
    static getBalances(api: ApiPromise): Promise<TBalances>;
    static getInvestedPools(api: ApiPromise, address: TTokenAddress): Promise<(TPool & {
        share: BN;
        firstTokenRatio: BN;
        secondTokenRatio: BN;
        activatedLPTokens: BN;
        nonActivatedLPTokens: BN;
    })[]>;
    static getPool(api: ApiPromise, liquidityTokenId: TTokenId): Promise<TPoolWithRatio>;
    static getPools(api: ApiPromise): Promise<TPoolWithRatio[]>;
}
//# sourceMappingURL=Query.d.ts.map
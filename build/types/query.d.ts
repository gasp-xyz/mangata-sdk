/// <reference types="bn.js" />
import { TokenId } from "./common";
import { BN } from "@polkadot/util";
import { Object } from "ts-toolbelt";
import { Pool } from "./xyk";
export declare type TToken = {
    id: TokenId;
    name: string;
    symbol: string;
    decimals: number;
    balance: TokenBalance;
};
export declare type TTokenInfo = Omit<TToken, "balance">;
export declare type TBalances = Record<TokenId, BN>;
export declare type TMainTokens = Record<TokenId, TTokenInfo>;
export declare type TokenBalance = {
    free: BN;
    reserved: BN;
    frozen: BN;
};
export declare type TPool = Object.Merge<Pool, {
    liquidityTokenId: TokenId;
    isPromoted: boolean;
}>;
export declare type TPoolWithRatio = Object.Merge<TPool, {
    firstTokenRatio: BN;
    secondTokenRatio: BN;
}>;
//# sourceMappingURL=query.d.ts.map
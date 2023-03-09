import { Amount, ExtrinsicCommon, TokenId, Address } from "./common";
import { Object } from "ts-toolbelt";
export declare type Rewards = {
    address: Address;
    liquidityTokenId: TokenId;
};
export declare type Reserve = {
    inputReserve: Amount;
    outputReserve: Amount;
    amount: Amount;
};
export declare type Price = {
    firstTokenId: TokenId;
    secondTokenId: TokenId;
    amount: Amount;
};
export declare type Liquidity = Object.Merge<ExtrinsicCommon, {
    liquidityTokenId: TokenId;
    amount: Amount;
}>;
export declare type BurnLiquidity = Object.Merge<Object.Omit<Liquidity, "liquidityTokenId">, Price>;
export declare type MintLiquidity = Object.Merge<Omit<BurnLiquidity, "amount">, {
    firstTokenAmount: Amount;
    expectedSecondTokenAmount: Amount;
}>;
export declare type Asset = {
    soldTokenId: TokenId;
    boughtTokenId: TokenId;
    amount: Amount;
};
export declare type MaxAmountIn = Object.Merge<Asset, {
    maxAmountIn: Amount;
}>;
export declare type MinAmountOut = Object.Merge<Asset, {
    minAmountOut: Amount;
}>;
export declare type BuyAsset = Object.Merge<ExtrinsicCommon, MaxAmountIn>;
export declare type SellAsset = Object.Merge<ExtrinsicCommon, MinAmountOut>;
export declare type Pool = {
    firstTokenId: TokenId;
    firstTokenAmount: Amount;
    secondTokenId: TokenId;
    secondTokenAmount: Amount;
};
export declare type CreatePool = Object.Merge<ExtrinsicCommon, Pool>;
//# sourceMappingURL=xyk.d.ts.map
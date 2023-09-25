import {
  TokenAmount,
  ExtrinsicCommon,
  TokenId,
  Address,
  Prettify
} from "./common";

import { Merge, Except } from "type-fest";

export type BurnAmount = {
  firstAssetAmount: TokenAmount;
  secondAssetAmount: TokenAmount;
};

export type TradeAbleTokens = {
    tokenId: string,
    decimals: number,
    name: string,
    symbol: string
}

export type Rewards = {
  address: Address;
  liquidityTokenId: TokenId;
};

export type Reserve = {
  inputReserve: TokenAmount;
  outputReserve: TokenAmount;
  amount: TokenAmount;
};

export type Price = {
  firstTokenId: TokenId;
  secondTokenId: TokenId;
  amount: TokenAmount;
};

export type Liquidity = Merge<
  ExtrinsicCommon,
  {
    liquidityTokenId: TokenId;
    amount: TokenAmount;
  }
>;

export type BurnLiquidity = Merge<Except<Liquidity, "liquidityTokenId">, Price>;

export type MintLiquidity = Prettify<
  Merge<
    Omit<BurnLiquidity, "amount">,
    {
      firstTokenAmount: TokenAmount;
      expectedSecondTokenAmount: TokenAmount;
    }
  >
>;

export type Asset = {
  soldTokenId: TokenId;
  boughtTokenId: TokenId;
  amount: TokenAmount;
};

export type MaxAmountIn = Merge<Asset, { maxAmountIn: TokenAmount }>;
export type MinAmountOut = Merge<Asset, { minAmountOut: TokenAmount }>;

export type PoolBase = {
  firstTokenId: TokenId;
  firstTokenAmount: TokenAmount;
  secondTokenId: TokenId;
  secondTokenAmount: TokenAmount;
};

export type CreatePool = Merge<ExtrinsicCommon, PoolBase>;

export type MintLiquidityFee = Except<MintLiquidity, "txOptions">;
export type DeactivateLiquidityFee = Except<Liquidity, "txOptions">;
export type CreatePoolFee = Except<CreatePool, "txOptions">;
export type ClaimRewardsFee = Except<Omit<Liquidity, "amount">, "txOptions">;
export type BurnLiquidityFee = Except<BurnLiquidity, "txOptions">;
export type ActivateLiquidityFee = Except<Liquidity, "txOptions">;
export type MultiSwapBase = Merge<
  ExtrinsicCommon,
  {
    tokenIds: TokenId[];
    amount: TokenAmount;
  }
>;

export type MultiswapSellAsset = Merge<
  MultiSwapBase,
  { minAmountOut: TokenAmount }
>;

export type MultiswapBuyAsset = Merge<
  MultiSwapBase,
  { maxAmountIn: TokenAmount }
>;

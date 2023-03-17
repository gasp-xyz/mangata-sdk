import { Amount, ExtrinsicCommon, TokenId, Address } from "./common";
import { Merge, Except } from "type-fest";

export type Rewards = {
  address: Address;
  liquidityTokenId: TokenId;
};

export type Reserve = {
  inputReserve: Amount;
  outputReserve: Amount;
  amount: Amount;
};

export type Price = {
  firstTokenId: TokenId;
  secondTokenId: TokenId;
  amount: Amount;
};

export type Liquidity = Merge<
  ExtrinsicCommon,
  {
    liquidityTokenId: TokenId;
    amount: Amount;
  }
>;

export type BurnLiquidity = Merge<Except<Liquidity, "liquidityTokenId">, Price>;

export type MintLiquidity = Merge<
  Omit<BurnLiquidity, "amount">,
  {
    firstTokenAmount: Amount;
    expectedSecondTokenAmount: Amount;
  }
>;

export type Asset = {
  soldTokenId: TokenId;
  boughtTokenId: TokenId;
  amount: Amount;
};

export type MaxAmountIn = Merge<Asset, { maxAmountIn: Amount }>;
export type MinAmountOut = Merge<Asset, { minAmountOut: Amount }>;

export type BuyAsset = Merge<ExtrinsicCommon, MaxAmountIn>;
export type SellAsset = Merge<ExtrinsicCommon, MinAmountOut>;

export type Pool = {
  firstTokenId: TokenId;
  firstTokenAmount: Amount;
  secondTokenId: TokenId;
  secondTokenAmount: Amount;
};

export type CreatePool = Merge<ExtrinsicCommon, Pool>;

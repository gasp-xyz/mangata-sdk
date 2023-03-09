import { Amount, ExtrinsicCommon, TokenId, Address } from "./common";
import { Object } from "ts-toolbelt";

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

export type Liquidity = Object.Merge<
  ExtrinsicCommon,
  {
    liquidityTokenId: TokenId;
    amount: Amount;
  }
>;

export type BurnLiquidity = Object.Merge<
  Object.Omit<Liquidity, "liquidityTokenId">,
  Price
>;

export type MintLiquidity = Object.Merge<
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

export type MaxAmountIn = Object.Merge<Asset, { maxAmountIn: Amount }>;
export type MinAmountOut = Object.Merge<Asset, { minAmountOut: Amount }>;

export type BuyAsset = Object.Merge<ExtrinsicCommon, MaxAmountIn>;
export type SellAsset = Object.Merge<ExtrinsicCommon, MinAmountOut>;

export type Pool = {
  firstTokenId: TokenId;
  firstTokenAmount: Amount;
  secondTokenId: TokenId;
  secondTokenAmount: Amount;
};

export type CreatePool = Object.Merge<ExtrinsicCommon, Pool>;

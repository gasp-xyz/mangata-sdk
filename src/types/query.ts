import { TokenId } from "./common";
import { BN } from "@polkadot/util";
import { Object } from "ts-toolbelt";
import { Pool } from "./xyk";

export type TToken = {
  id: TokenId;
  name: string;
  symbol: string;
  decimals: number;
  balance: TokenBalance;
};

export type TTokenInfo = Omit<TToken, "balance">;
export type TBalances = Record<TokenId, BN>;
export type TMainTokens = Record<TokenId, TTokenInfo>;
export type TokenBalance = {
  free: BN;
  reserved: BN;
  frozen: BN;
};
export type TPool = Object.Merge<
  Pool,
  { liquidityTokenId: TokenId; isPromoted: boolean }
>;

export type TPoolWithRatio = Object.Merge<
  TPool,
  {
    firstTokenRatio: BN;
    secondTokenRatio: BN;
  }
>;
